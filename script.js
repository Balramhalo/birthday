const Balram = {
    alphabet: {
        'A': 'α', 'B': 'β', 'C': 'Γ', 'D': 'Δ',
        'E': 'ε', 'F': 'Φ', 'G': 'γ', 'H': 'η',
        'I': 'ι', 'J': 'ξ', 'K': 'κ', 'L': 'λ',
        'M': 'μ', 'N': 'ν', 'O': 'Ω', 'P': 'π',
        'Q': 'Ψ', 'R': 'ρ', 'S': 'σ', 'T': 'τ',
        'U': 'υ', 'V': 'ϑ', 'W': 'ω', 'X': 'χ',
        'Y': 'Υ', 'Z': 'ζ'
    },
    emojis: {
        happy: '😊',
        sad: '😢',
        angry: '😠',
        surprise: '😲'
    }
};

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

function detectEmotion(text) {
    const emotions = {
        happy: /\b(happy|joy|love|good)\b/i,
        sad: /\b(sad|bad|pain|cry)\b/i,
        angry: /\b(angry|hate|rage|mad)\b/i,
        surprise: /\b(wow|surprise|amaze)\b/i
    };
    
    for (const [emotion, regex] of Object.entries(emotions)) {
        if (regex.test(text)) {
            return Balram.emojis[emotion];
        }
    }
    return '';
}

function translateText() {
    const input = document.getElementById('inputText').value;
    const direction = document.getElementById('direction').value;
    let output = '';
    
    if (direction === 'enToBal') {
        output = input.toUpperCase().split('').map(char => 
            Balram.alphabet[char] || char
        ).join('');
        const emotion = detectEmotion(input);
        document.getElementById('emojiOutput').textContent = emotion;
    } else {
        const reverseMap = Object.fromEntries(
            Object.entries(Balram.alphabet).map(([k, v]) => [v, k])
        );
        output = input.split('').map(char =>
            reverseMap[char] || char
        ).join('').toLowerCase();
        document.getElementById('emojiOutput').textContent = '';
    }
    
    document.getElementById('outputText').textContent = output;
}

// Initialize particle background
function initParticles() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('particles-js').appendChild(renderer.domElement);

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
    const material = new THREE.PointsMaterial({ size: 1.5, color: 0x00ffff });
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

window.onload = () => {
    initParticles();
    showPage('home');
};