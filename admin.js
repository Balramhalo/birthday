class AdminManager {
    constructor() {
        this.dictionary = JSON.parse(localStorage.getItem('dictionary')) || [];
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(!currentUser || currentUser.id !== 1) {
            window.location.href = '/';
        }
    }

    addWord() {
        const newWord = document.getElementById('newWord').value;
        this.dictionary.push({
            english: newWord,
            balram: this.generateBalramWord(newWord),
            emojis: this.generateEmojis(newWord)
        });
        
        localStorage.setItem('dictionary', JSON.stringify(this.dictionary));
        alert('Word added!');
    }

    generateBalramWord(word) {
        // Add custom language generation logic
        return word.split('').reverse().join('') + '🐸';
    }

    generateEmojis(word) {
        // Add emoji mapping logic
        return ['😭', '🤡', '🐸'].slice(0, Math.min(3, word.length));
    }
}

const adminManager = new AdminManager();
window.addWord = () => adminManager.addWord();