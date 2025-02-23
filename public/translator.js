const { readFile, writeFile } = require('fs/promises');

const alphabet = {
    a: 'Alpha', b: 'Beta', c: 'Gamma', // Complete mapping
};

const emojiMap = {
    happy: '😊', cool: '🔥', // Your custom mappings
};

export default async (req, res) => {
    try {
        const { text } = req.body;
        
        // Transformation Rules
        const translated = 'Bal-' + text.split('').reverse().join('') + '-ram';
        
        // Emoji Assignment
        const emojis = Object.entries(emojiMap)
            .filter(([key]) => text.toLowerCase().includes(key))
            .map(([meaning, emoji]) => ({ emoji, meaning }));

        // Save to storage
        const storage = JSON.parse(await readFile('storage.json'));
        storage.translations.push({ original: text, translated, emojis });
        await writeFile('storage.json', JSON.stringify(storage));

        res.status(200).json({ original: text, translated, emojis });
    } catch (error) {
        res.status(500).json({ error: 'Translation failed' });
    }
};