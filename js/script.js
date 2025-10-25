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
  (async () => {
    try {
      const { createClient } = supabase;
      const SUPABASE_URL = 'https://zvkelfhmrjfvveembihp.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a2VsZmhtcmpmdnZlZW1iaWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NTQ2ODMsImV4cCI6MjA1MTAzMDY4M30.9SkJLjhgyYMEAo5RjIXmIqkb_lPCJWQfq1xpEfG1vCg';
      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      await supabaseClient.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }

    localStorage.removeItem('user');
    alert('You have been logged out successfully!');
    window.location.href = 'login.html';
  })();
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLogoutModal();
  });
}
