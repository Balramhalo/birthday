let currentUser = null;

async function handleAuth() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/api/' + (currentUser ? 'login' : 'register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('jwt', token);
        loadMainInterface();
    }
}

function generateBalramTranslation(text) {
    // Client-side fallback
    return text.split(' ').map(word => 
        [...word].reverse().join('') + '🎯' + String.fromCodePoint(0x1F600 + Math.random() * 80)
    ).join(' ');
}

function loadMainInterface() {
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('main-view').classList.remove('hidden');
    document.getElementById('input-text').addEventListener('input', function(e) {
        document.getElementById('output-text').textContent = generateBalramTranslation(e.target.value);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt');
    if (token) loadMainInterface();
});