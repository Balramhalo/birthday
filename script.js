// script.js
const BalramLanguage = {
    dictionary: {
        "rizz": { balram: "ज़िज़", emoji: "😎", meaning: "Charisma/Charm" },
        "slay": { balram: "स्ले", emoji: "💅", meaning: "To do exceptionally well" },
        "vibe": { balram: "वाइब", emoji: "🌀", meaning: "Atmosphere/Mood" },
        "sus": { balram: "सस", emoji: "🕵️", meaning: "Suspicious" },
        "ghost": { balram: "घोस्ट", emoji: "👻", meaning: "To ignore someone" }
    },
    
    translate(text) {
        return text.split(' ').map(word => {
            const balramWord = this.dictionary[word.toLowerCase()]?.balram || this.convertToBalram(word);
            const emoji = this.dictionary[word.toLowerCase()]?.emoji || this.getEmoji(word);
            return `${balramWord}${emoji}`;
        }).join(' ');
    },

    convertToBalram(word) {
        // Add conversion logic using Hindi/Japanese characters
        return word.split('').reverse().join('') + '🎯';
    },

    getEmoji(word) {
        const emojiMap = {
            happy: '😭', // Using ironic emoji
            sad: '🤡',
            angry: '😾',
            friend: '🧒',
            nature: '🐛'
        };
        return emojiMap[word.toLowerCase()] || '🐸';
    }
};

class UserSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.adminToken = null;
    }

    handleAuth() {
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        
        const user = this.users.find(u => u.username === username);
        if(user) {
            if(user.password === password) this.login(user);
            else alert("Wrong password!");
            return;
        }

        const newUser = {
            id: this.users.length + 1,
            username,
            password,
            isAdmin: this.users.length === 0,
            joined: new Date().toISOString()
        };
        
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        this.login(newUser);
    }

    login(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if(user.isAdmin) {
            this.adminToken = Math.random().toString(36).substr(2, 9);
            window.location.href = `admin-${this.adminToken}.html`;
        } else {
            document.getElementById('authModal').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
            document.getElementById('userId').textContent = user.id;
        }
    }

    // Add admin management methods
}

// Initialize
const userSystem = new UserSystem();
window.handleAuth = () => userSystem.handleAuth();