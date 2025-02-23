const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve static files (e.g., index.html)

// Environment Variables
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://codex-in2:codex-in2@codex-in2.gjv2c.mongodb.net/?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userId: { type: Number, unique: true },
  isAdmin: { type: Boolean, default: false },
  translations: [{ input: String, output: String, timestamp: Date }],
});
const User = mongoose.model('User', UserSchema);

// Dynamic Admin URL (changes every 5 minutes)
let adminUrl = `/admin-${Math.random().toString(36).substring(2, 10)}`;
setInterval(() => {
  adminUrl = `/admin-${Math.random().toString(36).substring(2, 10)}`;
}, 5 * 60 * 1000);

// Balram Language Generator
const balramAlphabet = 'ABCD EFGHI JKLM NOPQ RSTU VWXYZ'.split(' ');
const genWord = (input) => {
  let word = '';
  for (let char of input.toLowerCase()) {
    const idx = char.charCodeAt(0) - 97;
    word += idx >= 0 && idx < 26 ? balramAlphabet[Math.floor(idx / 5)] + (idx % 5 + 1) : char;
  }
  return word + ' 😎'; // Example emoji meaning
};

// Middleware to Verify Token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const count = await User.countDocuments();
    const userId = count + 1;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, userId, isAdmin: userId === 1 });
    await user.save();
    const token = jwt.sign({ userId, username, isAdmin: userId === 1 }, JWT_SECRET);
    res.json({ token, redirect: '/translator' });
  } catch (err) {
    res.status(400).json({ message: 'Username taken or error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.userId, username, isAdmin: user.isAdmin }, JWT_SECRET);
  res.json({ token, redirect: '/translator' });
});

app.get('/user', verifyToken, async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  res.json({ userId: user.userId, username: user.username, isAdmin: user.isAdmin, translations: user.translations });
});

app.post('/translate', verifyToken, async (req, res) => {
  const { input } = req.body;
  const output = genWord(input);
  const user = await User.findOne({ userId: req.user.userId });
  user.translations.push({ input, output, timestamp: new Date() });
  await user.save();
  res.json({ output, breakdown: `Word: ${output.split(' ')[0]} | Emoji: Cool 😎` });
});

app.get('/vocabulary', verifyToken, (req, res) => {
  res.json({ alphabet: balramAlphabet, pronunciation: 'A as "ah", B as "beh", etc.', emoji: '😎 = Cool' });
});

app.get('/history', verifyToken, async (req, res) => {
  const user = await User.findOne({ userId: req.user.userId });
  res.json(user.translations);
});

app.get('/owner', verifyToken, (req, res) => {
  res.json({ creator: 'You', info: 'Inspired by Gen Z, Hindi, Morse, etc.' });
});

app.get(adminUrl, verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' });
  const stats = {
    activeUsers: await User.countDocuments(),
    loginHistory: await User.find().select('username userId translations.timestamp'),
  };
  res.json({ stats, adminUrl });
});

app.post(`${adminUrl}/manage`, verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' });
  const { action, targetUserId } = req.body;
  if (action === 'promote') await User.updateOne({ userId: targetUserId }, { isAdmin: true });
  if (action === 'ban') await User.deleteOne({ userId: targetUserId });
  if (action === 'reset') await User.updateMany({}, { translations: [] });
  res.json({ message: `${action} completed` });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));