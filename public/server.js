const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Load storage.json
const STORAGE_PATH = path.join(__dirname, 'public', 'storage.json');

// API to get vocabulary data
app.get('/api/vocabulary', async (req, res) => {
  try {
    const data = await fs.readFile(STORAGE_PATH, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load vocabulary' });
  }
});

// API to generate and store new words
app.post('/api/translate', async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Input required' });

  const data = JSON.parse(await fs.readFile(STORAGE_PATH, 'utf-8'));
  const alphabet = data.alphabet;
  const words = data.words;

  // Self-generating algorithm: Simple consonant-vowel pattern
  const generateWord = (word) => {
    let newWord = '';
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      newWord += alphabet[Math.floor(Math.random() * alphabet.length)].symbol;
    }
    const emoji = ['😊', '🌟', '🚀', '🌍'][Math.floor(Math.random() * 4)];
    return { word: newWord, meaning: word, emoji };
  };

  const translated = input.split(' ').map(word => {
    const existing = words.find(w => w.meaning === word);
    if (existing) return existing;
    const newWord = generateWord(word);
    words.push(newWord);
    return newWord;
  });

  await fs.writeFile(STORAGE_PATH, JSON.stringify({ alphabet, words }, null, 2));
  res.json(translated);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));