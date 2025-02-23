class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.dictionary = JSON.parse(localStorage.getItem('dictionary')) || [];
    }

    handleAuth() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const user = this.users.find(u => u.username === username);
        
        if(user) {
            if(user.password === password) {
                this.login(user);
                return;
            }
            alert('Wrong password!');
            return;
        }
        
        const newUser = {
            id: this.users.length + 1,
            username,
            password,
            isAdmin: this.users.length === 0
        };
        
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        this.login(newUser);
    }

    login(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if(user.id === 1) {
            window.location.href = 'adminPanel.html';
        } else {
            document.getElementById('authSection').classList.add('hidden');
            document.getElementById('mainSection').classList.remove('hidden');
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    }
}

const userManager = new UserManager();
window.handleAuth = () => userManager.handleAuth();
window.logout = () => userManager.logout();