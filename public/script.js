// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

// Add floating particles
const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(2000 * 3);
// Particle system setup...

// Interactive Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Translator Logic
async function translateText() {
    const input = document.getElementById('inputText').value;
    const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
    });
    
    const data = await response.json();
    displayTranslation(data);
}

function displayTranslation(result) {
    const output = document.getElementById('output');
    output.innerHTML = `
        <h3>${result.original}</h3>
        <p class="glow">${result.translated}</p>
        <div class="emoji-box">${result.emojis.map(e => `${e.emoji}: ${e.meaning}`).join(' ')}</div>
    `;
}

// Menu Toggle
function toggleMenu() {
    document.querySelector('nav').style.right = 
        document.querySelector('nav').style.right === '0px' ? '-250px' : '0px';
}