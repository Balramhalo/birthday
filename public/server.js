require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Models
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    userId: Number,
    isAdmin: Boolean,
    translations: [{
        input: String,
        output: String,
        timestamp: Date
    }]
}));

const app = express();
app.use(express.json());
app.use(passport.initialize());

// Passport Strategies
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) return done(null, false);
        return done(null, user);
    } catch (err) { return done(err); }
}));

passport.use(new JwtStrategy({
    jwtFromRequest: req => req.cookies?.jwt,
    secretOrKey: process.env.JWT_SECRET
}, (payload, done) => done(null, payload)));

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const count = await User.countDocuments();
        const user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            userId: count + 1,
            isAdmin: count === 0
        });
        await user.save();
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);
    res.json({ token });
});

app.get('/api/translate', passport.authenticate('jwt', { session: false }), (req, res) => {
    const translation = generateBalramTranslation(req.query.text);
    res.json({ translation });
});

// Admin Routes
app.get('/api/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Unauthorized' });
    res.json({ adminToken: generateDynamicAdminToken() });
});

function generateBalramTranslation(text) {
    // Combine Gen Z slang, Morse code, and multilingual patterns
    return text.split(' ').map(word => {
        const morphed = word.split('').reverse().join('')
            .replace(/a/gi, 'ꪖ').replace(/i/gi, '᛫').replace(/s/gi, 'ϟ')
            + String.fromCodePoint(0x1F600 + Math.floor(Math.random() * 80));
        return { original: word, translated: morphed };
    });
}

function generateDynamicAdminToken() {
    return Buffer.from(Date.now().toString()).toString('base64') + '-' + 
           crypto.randomBytes(16).toString('hex');
}

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));