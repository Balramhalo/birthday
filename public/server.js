// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

// Environment Setup
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://codex-in2:codex-in2@codex-in2.gjv2c.mongodb.net/?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: Number, unique: true },
  isAdmin: { type: Boolean, default: false },
  translations: [{ input: String, output: String, timestamp: { type: Date, default: Date.now } }],
});
const User = mongoose.model('User', userSchema);

// Dynamic Admin URL Generator
let adminToken = Math.random().toString(36).substring(2);
setInterval(() => adminToken = Math.random().toString(36).substring(2), 24 * 60 * 60 * 1000); // Regenerate daily

// Balram Language Translator Logic
const balramAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const generateBalramWord = (input) => {
  const influences = {
    morse: input.split('').map(c => c.charCodeAt(0) % 2 === 0 ? '.' : '-').join(''),
    hindi: input.slice(0, 2) + 'i',
    japanese: 'ka' + input.slice(-2),
    slang: input.slice(0, 3).toUpperCase() + 'Z',
  };
  const base = balramAlphabet[input.length % 26] + influences.slang + influences.morse.slice(0, 3);
  const emoji = input.length % 2 === 0 ? '✨' : '🔥';
  return { word: base.toLowerCase(), pronunciation: `/${base.toLowerCase()}/`, emoji };
};

// Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username taken' });
    const userCount = await User.countDocuments();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      userId: userCount + 1,
      isAdmin: userCount === 0, // First user is admin
    });
    await user.save();
    const token = jwt.sign({ userId: user.userId, isAdmin: user.isAdmin }, JWT_SECRET);
    res.status(201).json({ token, userId: user.userId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.userId, isAdmin: user.isAdmin }, JWT_SECRET);
    res.json({ token, userId: user.userId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Translator
app.post('/translate', authenticateToken, async (req, res) => {
  const { input } = req.body;
  const translation = generateBalramWord(input);
  const user = await User.findOne({ userId: req.user.userId });
  user.translations.push({ input, output: translation.word });
  await user.save();
  res.json({ translation });
});

// Vocabulary (Alphabet + Generated Words)
app.get('/vocabulary', authenticateToken, async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  res.json({
    alphabet: balramAlphabet.map(letter => ({ letter, pronunciation: `/${letter.toLowerCase()}/` })),
    words: user.translations.map(t => ({ word: t.output, input: t.input, emoji: t.input.length % 2 === 0 ? '✨' : '🔥' })),
  });
});

// History
app.get('/history', authenticateToken, async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  res.json(user.translations);
});

// Admin Dashboard
app.get(`/admin/${adminToken}`, authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' });
  const stats = {
    totalUsers: await User.countDocuments(),
    activeSessions: (await User.find()).length, // Simplified for demo
    loginHistory: await User.find().select('username userId translations.timestamp'),
  };
  res.json(stats);
});

// Admin Actions
app.post(`/admin/${adminToken}/manage`, authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' });
  const { action, targetUserId } = req.body;
  try {
    if (action === 'promote') await User.updateOne({ userId: targetUserId }, { isAdmin: true });
    if (action === 'ban') await User.deleteOne({ userId: targetUserId });
    if (action === 'reset') await User.updateMany({}, { $set: { translations: [] } });
    res.json({ message: `${action} successful` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));