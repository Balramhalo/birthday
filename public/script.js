// Balram Language Engine
class BalramGenerator {
    static vowels = ['a', 'e', 'i', 'o', 'u'];
    static consonants = ['b', 'd', 'g', 'k', 'm', 'n', 'r'];
    static emojiMap = new Map([
        ['happy', '😭'], ['sad', '🤡'], ['angry', '💥']
    ]);

    static generateWord(input) {
        return input.split('').reverse().join('')
            .replace(/a/gi, 'ꪖ')
            .replace(/i/gi, '᛫')
            .replace(/s/gi, 'ϟ')
            + this.getEmoji(input);
    }

    static getEmoji(word) {
        const key = word.toLowerCase();
        return this.emojiMap.get(key) || '🔮';
    }
}

// Auth System
class BalramAuth {
    static users = JSON.parse(localStorage.getItem('users')) || [];
    static currentUser = JSON.parse(localStorage.getItem('currentUser'));

    static handleAuth() {
        const username = document.getElementById('authUser').value;
        const password = document.getElementById('authPass').value;
        
        const user = this.users.find(u => u.username === username);
        if(user) {
            if(user.password === password) this.login(user);
            else this.showError('Access Denied');
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
    }

    static login(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if(user.isAdmin) {
            const adminToken = btoa(Date.now() + user.id + crypto.randomUUID());
            window.location.href = `admin.html?token=${adminToken}`;
        } else {
            document.getElementById('authPanel').classList.remove('active');
            document.getElementById('mainPanel').classList.add('active');
        }
    }
}

// Initialize
window.onload = () => {
    if(location.pathname.includes('admin.html')) {
        if(!validateAdminToken()) location.href = '/';
        else initializeAdminConsole();
    } else if(BalramAuth.currentUser) {
        document.getElementById('authPanel').classList.remove('active');
        document.getElementById('mainPanel').classList.add('active');
    }
};

// Event Bindings
window.handleAuth = () => BalramAuth.handleAuth();
window.logout = () => {
    localStorage.removeItem('currentUser');
    location.reload();
};