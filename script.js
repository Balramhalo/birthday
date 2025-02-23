class Translator {
    constructor() {
        this.dictionary = JSON.parse(localStorage.getItem('dictionary')) || [];
    }

    translate(text) {
        return text.split(' ').map(word => {
            const entry = this.dictionary.find(d => d.english.toLowerCase() === word.toLowerCase());
            return entry ? `${entry.balram} ${entry.emojis.join('')}` : word;
        }).join(' ');
    }
}

document.getElementById('inputText').addEventListener('input', function(e) {
    const translator = new Translator();
    const output = document.getElementById('output');
    output.innerHTML = translator.translate(e.target.value);
});