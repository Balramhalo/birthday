// user.js - handles user data in localStorage (mocking a real backend)

// Default admin user for demonstration
const defaultUsers = [
  { username: 'admin', password: 'admin', isAdmin: true, isBanned: false },
  { username: 'testuser', password: 'test123', isAdmin: false, isBanned: false }
];

// On first load, if no localStorage data, seed with default users
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// ---------- Utility Functions ---------- //
function getAllUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

function getUser(username) {
  const users = getAllUsers();
  return users.find(u => u.username === username);
}

function saveUser(updatedUser) {
  const users = getAllUsers();
  const index = users.findIndex(u => u.username === updatedUser.username);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
  }
}

function loginUser(username, password) {
  const user = getUser(username);
  if (!user) {
    alert('User not found.');
    return;
  }
  if (user.password !== password) {
    alert('Incorrect password.');
    return;
  }
  if (user.isBanned) {
    alert('You are banned.');
    return;
  }
  // If correct, store in localStorage
  localStorage.setItem('currentUser', JSON.stringify(user));
  alert(`Welcome, ${username}!`);
  window.location.reload();
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  alert('Logged out!');
  window.location.href = 'index.html';
}

function checkLoggedIn() {
  const user = localStorage.getItem('currentUser');
  return user ? true : false;
}

function checkAdmin() {
  const user = localStorage.getItem('currentUser');
  if (!user) return false;
  const parsed = JSON.parse(user);
  return parsed.isAdmin;
}