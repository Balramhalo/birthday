class UserSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.words = JSON.parse(localStorage.getItem('words')) || [];
    }

    handleAuth() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication
        const user = this.users.find(u => u.username === username);
        if(user) {
            if(user.password === password) {
                this.login(user);
                return;
            }
            alert('Wrong password!');
            return;
        }
        
        // Create new user
        const newUser = {
            id: this.users.length + 1,
            username,
            password,
            isAdmin: this.users.length === 0 // First user is admin
        };
        
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        this.login(newUser);
    }

    login(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        if(user.id === 1) window.location.href = 'adminPanel.html';
        else window.location.href = '#main';
    }
}

const userSystem = new UserSystem();
window.handleAuth = () => userSystem.handleAuth();