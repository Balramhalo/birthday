const express = require('express');
const router = express.Router();

// Dummy translation function
const translateToBalram = (text) => {
    // Implement your translation logic here
    return text.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
};

router.post('/translate', (req, res) => {
    const { text } = req.body;
    const translatedText = translateToBalram(text);
    res.json({ translatedText });
});

module.exports = router;