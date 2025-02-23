require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  userId: Number,
  isAdmin: Boolean,
  translations: [Object],
  createdAt: { type: Date, default: Date.now }
});

const AdminTokenSchema = new mongoose.Schema({
  token: String,
  expires: Date
});

const User = mongoose.model('User', UserSchema);
const AdminToken = mongoose.model('AdminToken', AdminTokenSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {}
  }
  next();
});

// Auth Routes
app.post('/register', async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const count = await User.countDocuments();
    const user = new User({
      username: req.body.username,
      password: hashedPass,
      userId: count + 1,
      isAdmin: count === 0
    });
    await user.save();
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Translator Logic
const generateBalramWord = (input) => {
  // Custom algorithm combining multiple language elements
  const syllables = input.match(/[aeiouy]+|[^aeiouy]+/gi) || [];
  return syllables.map(s => 
    s.replace(/th/gi, 'ð')
     .replace(/sh/gi, 'š')
     .slice(0, 3)
  ).join('') + '🦋';
};

app.post('/translate', async (req, res) => {
  if (!req.user) return res.status(401).send();
  const translation = {
    input: req.body.text,
    output: generateBalramWord(req.body.text),
    timestamp: new Date()
  };
  await User.updateOne({ userId: req.user.userId }, { $push: { translations: translation } });
  res.json(translation);
});

// Admin Routes
app.get('/admin-url', async (req, res) => {
  if (!req.user?.isAdmin) return res.status(403).send();
  const newToken = Math.random().toString(36).slice(2);
  await AdminToken.deleteMany();
  await new AdminToken({ token: newToken, expires: new Date(Date.now() + 3600000) }).save();
  res.json({ url: `/admin-${newToken}` });
});

app.listen(process.env.PORT, () => console.log('Server running'));