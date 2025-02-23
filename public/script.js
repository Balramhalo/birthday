// Core System
const BalramSystem = {
    users: JSON.parse(localStorage.getItem('users')) || [],
    dictionary: JSON.parse(localStorage.getItem('dictionary')) || [],
    currentUser: null,
    adminToken: null,

    init() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(this.currentUser) this.handleSession();
    },

    handleAuth() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = this.users.find(u => u.username === username);
        if(user) {
            if(user.password === password) this.login(user);
            else this.showError('AUTH_FAILURE');
            return;
        }

        const newUser = {
            id: this.users.length + 1,
            username,
            password,
            isAdmin: this.users.length === 0,
            sessionToken: crypto.randomUUID()
        };
        
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        this.login(newUser);
    },

    login(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if(user.isAdmin) {
            this.adminToken = `admin-${Date.now()}-${crypto.randomUUID()}`;
            window.location.href = `admin.html?token=${this.adminToken}`;
        } else {
            document.getElementById('authSection').classList.add('hidden');
            document.getElementById('mainSection').classList.remove('hidden');
            this.initTranslator();
        }
    },

    initTranslator() {
        document.getElementById('inputText').addEventListener('input', (e) => {
            const output = this.translate(e.target.value);
            document.getElementById('outputText').innerHTML = output;
        });
    },

    translate(input) {
        return input.split(' ').map(word => {
            const exists = this.dictionary.find(d => d.word === word.toLowerCase());
            if(exists) return `${exists.balram}${exists.emoji}`;
            
            // Generate new word
            const newWord = {
                word: word.toLowerCase(),
                balram: this.generateBalramWord(word),
                emoji: this.getEmoji(word),
                createdBy: this.currentUser.id
            };
            
            this.dictionary.push(newWord);
            localStorage.setItem('dictionary', JSON.stringify(this.dictionary));
            return `${newWord.balram}${newWord.emoji}`;
        }).join(' ');
    },

    generateBalramWord(word) {
        // Combine Gen Z slang + multi-language rules
        return word.split('').reverse().join('')
            .replace(/a/gi, 'ꪖ')
            .replace(/i/gi, '᛫')
            .replace(/o/gi, 'ᴑ')
            + '🎯';
    },

    getEmoji(word) {
        const emojiDB = {
            happy: '😭', 
            sad: '🤡',
            love: '🦋',
            angry: '💥',
            friend: '🧑💻'
        };
        return emojiDB[word.toLowerCase()] || '🔮';
    },

    // Admin functions
    forgeWord() {
        const input = document.getElementById('newWord').value;
        // Add admin word creation logic
    }
};

// Initialize
window.onload = () => BalramSystem.init();
window.handleAuth = () => BalramSystem.handleAuth();
window.logout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
};