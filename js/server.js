require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// test backend
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend ACC!' });
});
// endpoint to supabase to ambil quiz
app.get('/api/quiz', async (req, res) => {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const SUPABASE_URL = 'https://zvkelfhmrjfvveembihp.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_KEY; 
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/quiz_questions`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await resp.json();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});