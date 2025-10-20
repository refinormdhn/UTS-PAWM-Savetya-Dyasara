const user = localStorage.getItem('user');
const profileIcon = document.getElementById('profileIcon');
const modal = document.getElementById('logoutModal');

if (profileIcon) {
  profileIcon.addEventListener('click', () => {
    if (user) {
      modal.classList.add('active');
    } else {
      window.location.href = 'login.html';
    }
  });
}

function closeLogoutModal() {
  modal.classList.remove('active');
}

function confirmLogout() {
  localStorage.removeItem('user');
  alert('You have been logged out successfully!');
  window.location.href = 'login.html';
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLogoutModal();
  });
}
