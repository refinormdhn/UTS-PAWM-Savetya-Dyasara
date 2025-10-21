import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://zvkelfhmrjfvveembihp.supabase.co";
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a2VsZmhtcmpmdnZlZW1iaWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTQxOTIsImV4cCI6MjA3NjIzMDE5Mn0.pYNKv2BwrWwG2eJDrPBlXr8S3lLptoVph9Ql0y4IIO0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const user = localStorage.getItem('user');
if (user) {
  window.location.href = 'index.html';
}

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

// Login function
async function handleLogin(event) {
  event.preventDefault();
  
  const email = event.target.querySelector('input[type="email"]').value;
  const password = event.target.querySelector('input[type="password"]').value;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    alert('Invalid email or password!');
    return;
  }

  localStorage.setItem('user', JSON.stringify(data));
  alert('Login successful!');
  window.location.href = 'index.html';
}

// Register function
async function handleRegister(event) {
  event.preventDefault();
  
  const formInputs = event.target.querySelectorAll('input');
  const fullName = formInputs[0].value;
  const email = formInputs[1].value;
  const password = formInputs[2].value;
  const confirmPassword = formInputs[3].value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Check error:', checkError);
    alert('Error checking email: ' + checkError.message);
    return;
  }

  if (existingUser) {
    alert('Email already registered!');
    return;
  }

  const { error } = await supabase
    .from('users')
    .insert([{ 
      full_name: fullName,
      email: email, 
      password: password 
    }]);

  if (error) {
    console.error('Registration error:', error);
    alert('Registration failed: ' + error.message);
    return;
  }

  alert('Registration successful! Please login.');
  toggleForm('login');
  event.target.reset();
}

window.toggleForm = toggleForm;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;