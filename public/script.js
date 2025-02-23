function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('open');
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  toggleMenu();
}

async function translate() {
  const input = document.getElementById('input').value;
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });
  const data = await response.json();
  const output = document.getElementById('output');
  output.innerHTML = data.map(w => `${w.word} (${w.meaning}) ${w.emoji}`).join('<br>');
}

async function loadVocabulary() {
  const response = await fetch('/api/vocabulary');
  const data = await response.json();
  const output = document.getElementById('vocab-output');
  output.innerHTML = `
    <h2>Alphabet</h2>
    ${data.alphabet.map(a => `${a.symbol} - ${a.pronunciation}`).join('<br>')}
    <h2>Words</h2>
    ${data.words.map(w => `${w.word} - ${w.meaning} ${w.emoji}`).join('<br>')}
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadVocabulary();
});