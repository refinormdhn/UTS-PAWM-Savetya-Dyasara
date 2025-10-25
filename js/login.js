import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://zvkelfhmrjfvveembihp.supabase.co";
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a2VsZmhtcmpmdnZlZW1iaWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTQxOTIsImV4cCI6MjA3NjIzMDE5Mn0.pYNKv2BwrWwG2eJDrPBlXr8S3lLptoVph9Ql0y4IIO0';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function getReturnUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('return');
}

(async function hydrateFromSession() {
  // If Supabase session exists, persist minimal user to localStorage and redirect
  const { data: { session } } = await supabase.auth.getSession();
  const ret = getReturnUrl();
  if (session && session.user) {
    localStorage.setItem('user', JSON.stringify({ id: session.user.id, email: session.user.email }));
    if (ret) window.location.href = decodeURIComponent(ret); else window.location.href = 'index.html';
  }
})();

(function redirectIfLoggedIn() {
  const user = localStorage.getItem('user');
  const ret = getReturnUrl();
  if (user) {
    window.location.href = ret ? decodeURIComponent(ret) : 'index.html';
  }
})();

function toggleForm(formType) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (formType === 'register') { loginForm.classList.remove('active'); registerForm.classList.add('active'); }
  else { registerForm.classList.remove('active'); loginForm.classList.add('active'); }
}

async function googleLogin() {
  const ret = getReturnUrl();
  const redirectTo = `${window.location.origin}${window.location.pathname}?${ret ? 'return='+encodeURIComponent(ret) : ''}`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        // Forces account chooser on Google
        prompt: 'select_account'
      }
    }
  });
  if (error) alert('Google login failed: ' + error.message);
}

// Legacy email/password removed from flow; keep functions if you still want them
async function handleLogin(event) { /* ...existing code... */ }
async function handleRegister(event) { /* ...existing code... */ }

window.toggleForm = toggleForm;
window.googleLogin = googleLogin;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;