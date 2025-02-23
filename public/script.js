// Initialize 3D Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Add 3D Stars
const stars = new THREE.BufferGeometry();
const starVertices = [];
for(let i = 0; i < 10000; i++) {
    starVertices.push(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
    );
}
stars.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.7 });
const starField = new THREE.Points(stars, starMaterial);
scene.add(starField);

camera.position.z = 5;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    starField.rotation.x += 0.0005;
    starField.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
animate();

// Language Functions
async function generateTranslation() {
    const input = document.getElementById('input-text').value;
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
    });
    
    const data = await response.json();
    document.getElementById('output').innerHTML = `
        <div class="word-breakdown">
            <h3>${data.symbol}</h3>
            <p>Pronunciation: ${data.pronunciation}</p>
            <p>Emoji Meaning: ${data.emoji}</p>
            <p>Generated from: ${data.generatedFrom}</p>
        </div>
    `;
}

// UI Controls
function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('hidden');
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    toggleMenu();
}

// Initialize Vocabulary
async function loadVocabulary() {
    const response = await fetch('/api/vocabulary');
    const words = await response.json();
    const vocabDiv = document.getElementById('vocab');
    vocabDiv.innerHTML = words.map(word => `
        <div class="word-card">
            <h3>${word.symbol}</h3>
            <p>${word.pronunciation}</p>
            <p>${word.emoji}</p>
            <small>From: ${word.generatedFrom}</small>
        </div>
    `).join('');
}

window.onload = loadVocabulary;