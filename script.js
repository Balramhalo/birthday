const conversation = [
    { type: 'typing', duration: 1200 },
    { text: 'Oyeeee sun', sender: 'received' },
    { text: 'Hn bol rhe', sender: 'sent' },
    { type: 'typing', duration: 1800 },
    { text: 'me kesa lagta hu tujhe???', sender: 'received' }
];

let currentStep = 0;
let lastSeen = null;
let isModalOpen = false;

// Elements
const chatArea = document.getElementById('chatArea');
const modalOverlay = document.getElementById('modalOverlay');
const achaBtn = document.getElementById('achaBtn');
const bekarBtn = document.getElementById('bekarBtn');

function showConversationStep() {
    if (currentStep >= conversation.length) {
        showOptionsModal();
        return;
    }

    const step = conversation[currentStep];
    
    if (step.type === 'typing') {
        showTypingIndicator();
        setTimeout(() => {
            currentStep++;
            showConversationStep();
        }, step.duration);
    } else {
        createMessageElement(step.text, step.sender);
        currentStep++;
        setTimeout(showConversationStep, 800);
    }
}

function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'ig-message-row ig-received';
    typing.innerHTML = `
        <div class="ig-message-bubble">
            <div class="ig-typing-indicator">
                <div class="ig-typing-dot"></div>
                <div class="ig-typing-dot" style="animation-delay: 0.2s"></div>
                <div class="ig-typing-dot" style="animation-delay: 0.4s"></div>
            </div>
        </div>
    `;
    chatArea.appendChild(typing);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function createMessageElement(text, sender) {
    const messageRow = document.createElement('div');
    messageRow.className = `ig-message-row ${sender === 'sent' ? 'ig-sent' : 'ig-received'}`;

    const bubble = document.createElement('div');
    bubble.className = 'ig-message-bubble';
    bubble.textContent = text;

    if (sender === 'sent') {
        if (lastSeen) lastSeen.remove();
        const seen = document.createElement('div');
        seen.className = 'ig-seen-indicator';
        seen.textContent = 'Seen just now';
        bubble.appendChild(seen);
        lastSeen = seen;
    } else {
        const profilePic = document.createElement('img');
        profilePic.className = 'ig-profile-pic';
        profilePic.src = 'https://i.ibb.co/Jj238NKv/profile-pic.jpg';
        messageRow.appendChild(profilePic);
    }

    messageRow.appendChild(bubble);
    chatArea.appendChild(messageRow);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function showOptionsModal() {
    modalOverlay.style.display = 'flex';
    isModalOpen = true;
}

function handleAcha() {
    if (!isModalOpen) return;
    modalOverlay.style.display = 'none';
    isModalOpen = false;
    
    createMessageElement('tu bohot acha lagta hai', 'sent');
    
    setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
            createMessageElement('tu bhi lagti hai mujh bohot achi', 'received');
        }, 1500);
    }, 800);
}

function handleBekar() {
    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 200 - 100;
    bekarBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

// Event Listeners
modalOverlay.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.style.display = 'none';
        isModalOpen = false;
    }
});

achaBtn.addEventListener('click', handleAcha);
bekarBtn.addEventListener('click', handleBekar);

// Initialize conversation
setTimeout(showConversationStep, 800);