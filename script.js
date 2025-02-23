// script.js - handles site-wide logic

// -------------- MAIN PAGE LOGIC -------------- //
window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = checkLoggedIn();
  const isAdmin = checkAdmin();

  const btnLogin = document.getElementById('btn-login');
  const btnLogout = document.getElementById('btn-logout');
  const translatorSection = document.getElementById('translator-section');
  const adminMessage = document.getElementById('admin-message');

  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      openLoginModal();
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logoutUser();
    });
  }

  // If user is on index.html
  if (translatorSection) {
    if (isLoggedIn) {
      // Show translator
      translatorSection.style.display = 'block';
      btnLogin.style.display = 'none';
      btnLogout.style.display = 'inline-block';

      if (isAdmin) {
        adminMessage.style.display = 'block';
      }
    }
  }

  // Translator button
  const translateBtn = document.getElementById('translate-btn');
  if (translateBtn) {
    translateBtn.addEventListener('click', () => {
      const phraseInput = document.getElementById('input-text').value;
      const sourceLang = document.getElementById('sourceLang').value;
      const translation = dummyTranslate(phraseInput, sourceLang);
      document.getElementById('translation-result').innerHTML = `
        <p><strong>Original:</strong> ${phraseInput}</p>
        <p><strong>Translation (Balram):</strong> ${translation}</p>
      `;
    });
  }

  // -------------- ADMIN PANEL LOGIC -------------- //
  // If user is on adminPanel.html
  const userListDiv = document.getElementById('user-list');
  if (userListDiv) {
    if (!isAdmin) {
      // If not admin, redirect or show message
      alert('Access denied. Admins only.');
      window.location.href = 'index.html';
    } else {
      // Show list of users
      displayUserList();

      const banBtn = document.getElementById('ban-btn');
      banBtn.addEventListener('click', () => {
        const banUser = document.getElementById('ban-username').value.trim();
        if (banUser) {
          banUserByUsername(banUser);
        }
      });

      // Logout on admin panel
      const logoutButton = document.getElementById('btn-logout');
      logoutButton.addEventListener('click', () => {
        logoutUser();
      });
    }
  }
});

// -------------- TRANSLATION FUNCTION (DEMO) -------------- //
function dummyTranslate(phrase, sourceLang) {
  // This is a placeholder. In a real app, you'd call an API or do actual logic.
  return `Balram(${sourceLang}): ${phrase.split('').reverse().join('')}`;
}

// -------------- ADMIN UTILS -------------- //
function displayUserList() {
  const users = getAllUsers();
  const userListDiv = document.getElementById('user-list');
  let html = '<ul>';
  users.forEach(u => {
    html += `<li><strong>${u.username}</strong> (Admin: ${u.isAdmin}), Banned: ${u.isBanned}</li>`;
  });
  html += '</ul>';
  userListDiv.innerHTML = html;
}

function banUserByUsername(username) {
  const resultP = document.getElementById('ban-result');
  const user = getUser(username);
  if (!user) {
    resultP.textContent = `User ${username} not found.`;
    return;
  }
  user.isBanned = true;
  saveUser(user);
  resultP.textContent = `User ${username} is now banned.`;
  displayUserList();
}

// -------------- LOGIN MODAL -------------- //
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  modal.style.display = 'block';
  const closeModal = document.getElementById('closeModal');
  closeModal.onclick = () => {
    modal.style.display = 'none';
  };

  const loginSubmit = document.getElementById('login-submit');
  loginSubmit.onclick = () => {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (username && password) {
      loginUser(username, password);
    }
  };
}