function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('hidden');
}

async function translate() {
    const phrase = document.getElementById('input-phrase').value;
    const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phrase })
    });
    const result = await response.json();
    document.getElementById('translation-result').innerText = `Balram Translation: ${result.balramWord} - ${result.emojiMeaning}`;
}

function showPage(page) {
    // Logic to show different pages (vocabulary, history, owner)
    alert(`Showing ${page} page!`);
}