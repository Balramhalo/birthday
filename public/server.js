require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const THREE = require('three');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// 3D Language Model
const balramSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    pronunciation: String,
    emoji: String,
    generatedFrom: String,
    timestamp: { type: Date, default: Date.now }
});

const BalramWord = mongoose.model('BalramWord', balramSchema);

const app = express();
app.use(express.json());

// 3D API Endpoints
app.post('/api/generate', async (req, res) => {
    const { input } = req.body;
    const newWord = generateBalramWord(input);
    await BalramWord.create(newWord);
    res.json(newWord);
});

app.get('/api/vocabulary', async (req, res) => {
    const words = await BalramWord.find().sort({ timestamp: -1 });
    res.json(words);
});

function generateBalramWord(input) {
    // 3D-inspired generation algorithm
    const symbols = ['α', 'β', 'γ', 'δ', 'ϵ', 'ζ', 'η', 'θ'];
    const emojis = ['🌀', '✨', '🌌', '💫', '⚡'];
    
    return {
        symbol: input.split('').reverse().map(c => 
            symbols[c.charCodeAt(0) % symbols.length]
        ).join(''),
        pronunciation: generatePronunciation(input),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        generatedFrom: input
    };
}

function generatePronunciation(input) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return input.split('').map(c => 
        vowels.includes(c.toLowerCase()) ? `/${c}/` : c.toUpperCase()
    ).join('-');
}

app.listen(process.env.PORT || 3000);