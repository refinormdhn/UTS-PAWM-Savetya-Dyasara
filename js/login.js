import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://zvkelfhmrjfvveembihp.supabase.co";
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a2VsZmhtcmpmdnZlZW1iaWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTQxOTIsImV4cCI6MjA3NjIzMDE5Mn0.pYNKv2BwrWwG2eJDrPBlXr8S3lLptoVph9Ql0y4IIO0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function toggleForm(formType) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (formType === 'register') {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
  } else {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const form = event.target;
  const fullName = form.querySelector('input[placeholder="Full Name"]').value.trim();
  const email = form.querySelector('input[placeholder="Email Address"]').value.trim();
  const password = form.querySelectorAll('input[placeholder="Password"]')[0].value.trim();
  const confirmPassword = form.querySelector('input[placeholder="Confirm Password"]').value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name: fullName, email: email, password: password }])
    .select();

  if (error) {
    console.error(error);
    alert("Registration failed: " + error.message);
    return;
  }

  alert("Registration successful! Please login.");
  toggleForm('login');
}

async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.querySelector('input[placeholder="Email Address"]').value.trim();
  const password = form.querySelector('input[placeholder="Password"]').value.trim();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    alert("❌ Invalid credentials. Try again!");
    return;
  }

  localStorage.setItem('user', JSON.stringify(data));
  alert("✅ Login successful!");
  window.location.href = 'index.html';
}

window.toggleForm = toggleForm;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;