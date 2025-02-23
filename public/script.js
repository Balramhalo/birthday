const toggleMenu = () => {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

const translate = async () => {
    const text = document.getElementById('inputText').value;
    const response = await fetch('/api/translator/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ text })
    });
    const data = await response.json();
    document.getElementById('output').innerText = data.translatedText;
};

const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
};