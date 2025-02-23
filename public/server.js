const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Load vocabulary from storage.json
let vocabulary = JSON.parse(fs.readFileSync('./data/storage.json', 'utf8'));

// API endpoint for translation
app.post('/api/translate', (req, res) => {
    const { phrase } = req.body;
    const balramWord = generateBalramWord(phrase);
    const emojiMeaning = getEmojiMeaning(balramWord);
    res.json({ balramWord, emojiMeaning });
});

// Function to generate Balram word
function generateBalramWord(phrase) {
    // Simple transformation logic
    return phrase.split('').reverse().join('') + 'Bal'; // Example transformation
}

// Function to get emoji meaning
function getEmojiMeaning(word) {
    return vocabulary[word] ? vocabulary[word].emoji : '😊'; // Default emoji
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});