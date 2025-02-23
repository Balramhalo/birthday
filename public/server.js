const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://codex-in2:codex-in2@codex-in2.gjv2c.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Vocabulary Schema
const vocabSchema = new mongoose.Schema({
  original: String,
  balram: String,
  breakdown: Object,
  createdAt: { type: Date, default: Date.now }
});
const Vocabulary = mongoose.model('Vocabulary', vocabSchema);

// Balram Language Alphabet (simplified for demo)
const alphabet = {
  a: 'Alpha', b: 'Beta', c: 'Gamma', d: 'Delta', e: 'Epsilon',
  f: 'Phi', g: 'Gamma', h: 'Eta', i: 'Iota', j: 'Kappa',
  k: 'Kappa', l: 'Lambda', m: 'Mu', n: 'Nu', o: 'Omicron',
  p: 'Pi', q: 'Kappa', r: 'Rho', s: 'Sigma', t: 'Tau',
  u: 'Upsilon', v: 'Phi', w: 'Omega', x: 'Chi', y: 'Psi', z: 'Zeta'
};

// Self-generating translator algorithm
function generateBalramWord(input) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let breakdown = { mapping: [], rules: [], emojis: [] };
  let balramWord = '';

  // Step 1: Break into characters
  const chars = input.toLowerCase().split('');

  // Step 2: Map characters to Balram alphabet
  chars.forEach(char => {
    if (alphabet[char]) {
      breakdown.mapping.push(`${char} -> ${alphabet[char]}`);
      balramWord += alphabet[char];
    }
  });

  // Step 3: Apply morphological rules
  if (vowels.includes(chars[0])) {
    balramWord = 'Om-' + balramWord; // Prefix for vowel-starting words
    breakdown.rules.push('Added prefix "Om-" for vowel start');
  }
  if (chars.length > 3) {
    balramWord += '-Ka'; // Suffix for longer words
    breakdown.rules.push('Added suffix "-Ka" for word length > 3');
  }

  // Step 4: Emoji integration
  if (input.match(/(.)\1/)) { // Repeated characters
    balramWord += ' 🔥';
    breakdown.emojis.push('🔥 = Emphasis (repeated syllable)');
  } else if (input.length < 3) {
    balramWord += ' 😊';
    breakdown.emojis.push('😊 = Simple/Cute (short word)');
  }

  return { balram: balramWord, breakdown };
}

// API Endpoints
app.post('/api/translate', async (req, res) => {
  const { phrase } = req.body;
  if (!phrase) return res.status(400).json({ error: 'Phrase required' });

  const words = phrase.split(' ');
  const translations = await Promise.all(words.map(async word => {
    const { balram, breakdown } = generateBalramWord(word);
    const vocabEntry = new Vocabulary({ original: word, balram, breakdown });
    await vocabEntry.save();
    return { original: word, balram, breakdown };
  }));

  res.json({ translated: translations.map(t => t.balram).join(' '), details: translations });
});

app.get('/api/vocabulary', async (req, res) => {
  const vocab = await Vocabulary.find().sort({ createdAt: -1 });
  res.json(vocab);
});

app.get('/api/history', (req, res) => {
  res.json({ content: 'Balram Language evolved from Gen Z slang, Morse code, Hindi, English, Japanese, and Hinglish...' });
});

app.get('/api/owner', (req, res) => {
  res.json({ content: 'Created by [Your Name], inspired by linguistic fusion and futuristic design.' });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));