// 3D Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

camera.position.z = 30;

function animate() {
  requestAnimationFrame(animate);
  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
hamburger.addEventListener('click', () => menu.classList.toggle('active'));

// Page Navigation
const pages = document.querySelectorAll('.page');
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(link.dataset.page).classList.add('active');
    menu.classList.remove('active');
    loadPageContent(link.dataset.page);
  });
});

// API Interactions
async function translate() {
  const phrase = document.getElementById('input-phrase').value;
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phrase })
  });
  const data = await res.json();
  document.getElementById('output').innerHTML = `
    <h3>Translated: ${data.translated}</h3>
    <pre>${JSON.stringify(data.details, null, 2)}</pre>
  `;
}

async function loadPageContent(page) {
  if (page === 'vocabulary') {
    const res = await fetch('/api/vocabulary');
    const vocab = await res.json();
    document.getElementById('vocab-list').innerHTML = vocab.map(v => `
      <p><strong>${v.original}</strong> → ${v.balram}<br>
      Breakdown: ${JSON.stringify(v.breakdown)}</p>
    `).join('');
  } else if (page === 'history' || page === 'owner') {
    const res = await fetch(`/api/${page}`);
    const data = await res.json();
    document.getElementById(page).innerHTML = `<h2>${page.charAt(0).toUpperCase() + page.slice(1)}</h2><p>${data.content}</p>`;
  }
}

// Initial Load
loadPageContent('translator');