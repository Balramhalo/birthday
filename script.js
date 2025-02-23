// script.js
const BalramConfig = {
    alphabet: {
        'A': 'α', 'B': 'β', 'C': 'γ', 'D': 'δ',
        'E': 'ε', 'F': 'ζ', 'G': 'η', 'H': 'θ',
        'I': 'ι', 'J': 'κ', 'K': 'λ', 'L': 'μ',
        'M': 'ν', 'N': 'ξ', 'O': 'ο', 'P': 'π'
    },
    emojis: {
        happy: '😊',
        sad: '😢',
        angry: '👿',
        surprise: '✨'
    }
};

let currentPage = 'home';

function initThreeJS() {
    // Initialize 3D background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('particle-canvas').appendChild(renderer.domElement);

    // Add 3D particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ size: 2, color: 0x00ffff });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 1000;

    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();
}

function detectEmotion(text) {
    const emotions = {
        happy: /\b(happy|joy|love)\b/i,
        sad: /\b(sad|sorrow|pain)\b/i,
        angry: /\b(angry|hate|rage)\b/i,
        surprise: /\b(surprise|wow|amaze)\b/i
    };
    
    return Object.entries(emotions)
        .filter(([_, regex]) => regex.test(text))
        .map(([emotion]) => BalramConfig.emojis[emotion])
        .join(' ');
}

function translateText() {
    const input = document.getElementById('inputText').value;
    const direction = document.getElementById('langDirection').value;
    let output = '';
    
    if (direction === 'enToBal') {
        output = input.toUpperCase().split('').map(char => 
            BalramConfig.alphabet[char] || char
        ).join('');
        output += ' ' + detectEmotion(input);
    } else {
        const reverseMap = Object.fromEntries(
            Object.entries(BalramConfig.alphabet).map(([k, v]) => [v, k])
        );
        output = input.split('').map(char =>
            reverseMap[char] || char
        ).join('');
    }
    
    document.getElementById('outputText').innerHTML = output;
    animateResult();
}

function animateResult() {
    anime({
        targets: '#outputText',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .5)'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    // Initialize page transitions
    anime({
        targets: '.page.active',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        easing: 'easeOutExpo'
    });
});

// Add more interactive features and animations