const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Schemas
const UserSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  banned: { type: Boolean, default: false }
});
const VocabularySchema = new mongoose.Schema({
  english: String,
  balram: String,
  pronunciation: String,
  emoji: String
});
const User = mongoose.model('User', UserSchema);
const Vocabulary = mongoose.model('Vocabulary', VocabularySchema);

// Balram Language Generator
const vowels = ['a', 'e', 'i', 'o', 'u'];
const consonants = ['b', 'c', 'd', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't'];
function generateBalramWord() {
  const syllableCount = Math.floor(Math.random() * 2) + 1;
  let word = '';
  for (let i = 0; i < syllableCount; i++) {
    word += consonants[Math.floor(Math.random() * consonants.length)] +
            vowels[Math.floor(Math.random() * vowels.length)];
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Middleware for Authentication
const authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userCount = await User.countDocuments();
  const userId = userCount + 1;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    userId,
    username,
    password: hashedPassword,
    isAdmin: userId === 1
  });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.banned || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials or banned' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get('/user', authenticate, (req, res) => {
  res.json({ username: req.user.username, isAdmin: req.user.isAdmin });
});

app.post('/translate', authenticate, async (req, res) => {
  const { phrase } = req.body;
  const words = phrase.split(' ');
  const translated = await Promise.all(words.map(async word => {
    let vocab = await Vocabulary.findOne({ english: word.toLowerCase() });
    if (!vocab) {
      const balramWord = generateBalramWord();
      vocab = new Vocabulary({
        english: word.toLowerCase(),
        balram: balramWord,
        pronunciation: balramWord.toLowerCase().split('').join('-'),
        emoji: '😊'
      });
      await vocab.save();
    }
    return vocab;
  }));
  res.json({ translated: translated.map(v => `${v.balram} (${v.pronunciation}) ${v.emoji}`).join(' ') });
});

app.get('/vocabulary', authenticate, async (req, res) => {
  const vocab = await Vocabulary.find();
  res.json(vocab);
});

app.get('/admin/:dynamicKey', authenticate, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' });
  const stats = {
    userCount: await User.countDocuments(),
    vocabCount: await Vocabulary.countDocuments()
  };
  res.json(stats);
});

app.post('/admin/:dynamicKey/ban', authenticate, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' });
  const { userId } = req.body;
  await User.updateOne({ userId }, { banned: true });
  res.json({ message: 'User banned' });
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));