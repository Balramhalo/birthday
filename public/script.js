// script.js
const balramAlphabet = {
    'A': 'α', 'B': 'β', 'C': 'γ', 'D': 'δ',
    'E': 'ε', 'F': 'ζ', 'G': 'η', 'H': 'θ',
    'I': 'ι', 'J': 'κ', 'K': 'λ', 'L': 'μ',
    'M': 'ν', 'N': 'ξ', 'O': 'ο', 'P': 'π',
    // Add remaining characters as needed
};

let translations = JSON.parse(localStorage.getItem('translations')) || [];

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.left = sidebar.style.left === '0px' ? '-250px' : '0px';
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    toggleMenu();
}

function translateText() {
    const input = document.getElementById('inputText').value;
    const direction = document.getElementById('direction').value;
    let output = '';

    if (direction === 'enToBal') {
        output = input.toUpperCase().split('').map(char => 
            balramAlphabet[char] || char
        ).join('');
    } else {
        const reverseMap = Object.fromEntries(
            Object.entries(balramAlphabet).map(([k, v]) => [v, k])
        );
        output = input.split('').map(char =>
            reverseMap[char] || char
        ).join('');
    }

    document.getElementById('outputText').textContent = output;
    saveTranslation(input, output, direction);
}

function saveTranslation(input, output, direction) {
    translations.unshift({
        input,
        output,
        direction,
        timestamp: new Date().toISOString()
    });
    
    if (translations.length > 10) translations.pop();
    
    localStorage.setItem('translations', JSON.stringify(translations));
    displayHistory();
}

function displayHistory() {
    const historyBox = document.getElementById('translationHistory');
    historyBox.innerHTML = translations.map(trans => `
        <div class="history-item">
            <strong>${trans.direction === 'enToBal' ? 'EN→BL' : 'BL→EN'}</strong>
            <p>${trans.input} → ${trans.output}</p>
            <small>${new Date(trans.timestamp).toLocaleString()}</small>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2
    });
    
    displayHistory();
    showPage('home');
});