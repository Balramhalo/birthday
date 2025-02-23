function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

function translateToBalram() {
    const inputText = document.getElementById('inputText').value;
    const outputText = document.getElementById('outputText');
    
    // Simple translation logic
    const translationMap = {
        'A': 'α',
        'B': 'β',
        'C': 'γ',
        // Add more mappings as needed
    };

    let translated = '';
    for (let char of inputText) {
        translated += translationMap[char.toUpperCase()] || char;
    }

    outputText.innerText = translated;
}