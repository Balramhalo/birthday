const inputField = document.querySelector('.message-input');
const chatWindow = document.querySelector('.chat-window');
const sendButton = document.querySelector('.send-button');

sendButton.addEventListener('click', () => {
    const messageText = inputField.value;
    if (messageText.trim() !== '') {
        const newMessage = document.createElement('div');
        newMessage.classList.add('message', 'outgoing');
        newMessage.innerHTML = `<p>${messageText}</p><span class="timestamp">Now</span>`;
        chatWindow.appendChild(newMessage);
        inputField.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
    }
});