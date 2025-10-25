import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Auth gate: block unauthenticated users
(function enforceAuth() {
  try {
    const user = localStorage.getItem('user');
    if (!user) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.replace(`login.html?return=${returnUrl}`);
    }
  } catch (_) {
    window.location.replace('login.html');
  }
})();

const SUPABASE_URL = "https://zvkelfhmrjfvveembihp.supabase.co";
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a2VsZmhtcmpmdnZlZW1iaWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTQxOTIsImV4cCI6MjA3NjIzMDE5Mn0.pYNKv2BwrWwG2eJDrPBlXr8S3lLptoVph9Ql0y4IIO0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const user = localStorage.getItem('user');
const profileIcon = document.getElementById('profileIcon');

profileIcon.addEventListener('click', () => {
  if (user) document.getElementById('logoutModal').classList.add('active');
  else window.location.href = 'login.html';
});

function closeLogoutModal() {
  document.getElementById('logoutModal').classList.remove('active');
}

function confirmLogout() {
  (async () => {
    try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
    localStorage.removeItem('user');
    alert('You have been logged out successfully!');
    window.location.href = 'login.html';
  })();
}

document.getElementById('logoutModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLogoutModal();
});

let quizData = {};
let currentQuiz = [];
let currentQuestion = 0;
let userAnswers = [];
let draggedElement = null;
let draggedFromAnswer = false;
let currentMaterialId = null; // Track current material/topic

async function loadQuizData() {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .order('topic', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No questions found in database');
      alert('No questions available. Please contact administrator.');
      return false;
    }

    quizData = {};
    data.forEach(q => {
      if (!quizData[q.topic]) {
        quizData[q.topic] = [];
      }
      
      let correctAnswer;
      if (q.type === 'ordering') {
        correctAnswer = q.order_sequence;
      } else {
        correctAnswer = Array.isArray(q.correct_answer) ? q.correct_answer : [q.correct_answer];
      }
      
      quizData[q.topic].push({
        id: q.id, // Simpan ID question untuk referensi
        question: q.question,
        options: q.options,
        correct: correctAnswer,
        type: q.type
      });
    });

    console.log('Quiz data loaded successfully:', quizData);
    return true;
  } catch (error) {
    console.error('Error loading quiz data:', error);
    alert('Failed to load quiz questions. Please try again.\n\nError: ' + error.message);
    return false;
  }
}

async function startQuiz(materialId) {
  console.log('Starting quiz for material:', materialId);
  
  currentMaterialId = materialId; // Simpan material ID
  
  if (Object.keys(quizData).length === 0) {
    const loaded = await loadQuizData();
    if (!loaded) return;
  }

  currentQuiz = quizData[materialId] || [];
  
  if (currentQuiz.length === 0) {
    alert('No questions available for this material.');
    return;
  }

  currentQuestion = 0;
  userAnswers = new Array(currentQuiz.length).fill(null);

  document.getElementById('quizSelection').style.display = 'none';
  document.getElementById('quizContent').style.display = 'block';
  
  loadQuestion();
}

function loadQuestion() {
  const q = currentQuiz[currentQuestion];
  document.getElementById('questionNumber').textContent = `Question ${currentQuestion + 1} of ${currentQuiz.length}`;
  document.getElementById('questionText').textContent = q.question;

  const answerArea = document.getElementById('answerArea');
  const optionsContainer = document.getElementById('optionsContainer');

  if (q.type === 'ordering') {
    if (userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0) {
      answerArea.innerHTML = '<div class="ordering-list"></div>';
      const list = answerArea.querySelector('.ordering-list');
      userAnswers[currentQuestion].forEach((ans, index) => {
        const div = document.createElement('div');
        div.className = 'ordering-item option filled';
        div.textContent = ans;
        div.draggable = true;
        div.dataset.index = index;
        
        div.addEventListener('dragstart', e => {
          draggedElement = ans;
          draggedFromAnswer = true;
          e.dataTransfer.effectAllowed = 'move';
          div.style.opacity = '0.5';
        });
        
        div.addEventListener('dragend', e => {
          div.style.opacity = '1';
          draggedFromAnswer = false;
        });
        
        div.addEventListener('dragover', e => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        });
        
        div.addEventListener('drop', e => {
          e.preventDefault();
          e.stopPropagation();
          
          if (draggedFromAnswer && draggedElement !== ans) {
            const draggedIndex = userAnswers[currentQuestion].indexOf(draggedElement);
            const targetIndex = index;
            
            const newAnswers = [...userAnswers[currentQuestion]];
            newAnswers.splice(draggedIndex, 1);
            newAnswers.splice(targetIndex, 0, draggedElement);
            userAnswers[currentQuestion] = newAnswers;
            
            draggedElement = null;
            draggedFromAnswer = false;
            loadQuestion();
          }
        });
        
        list.appendChild(div);
      });
    } else {
      answerArea.innerHTML = '<span class="placeholder">Drag options here to order your answer</span>';
    }
  } else {
    answerArea.innerHTML = userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0
      ? userAnswers[currentQuestion].map(ans => `<div class="option filled">${ans}</div>`).join('')
      : '<span class="placeholder">Drag one option here</span>';
  }

  optionsContainer.innerHTML = '';
  q.options.forEach(opt => {
    if (!userAnswers[currentQuestion] || !userAnswers[currentQuestion].includes(opt)) {
      const div = document.createElement('div');
      div.className = 'option';
      div.textContent = opt;
      div.draggable = true;
      
      div.addEventListener('dragstart', e => {
        draggedElement = opt;
        draggedFromAnswer = false;
        e.dataTransfer.effectAllowed = 'move';
      });
      
      optionsContainer.appendChild(div);
    }
  });

  answerArea.ondragover = e => {
    e.preventDefault();
    if (!draggedFromAnswer) {
      answerArea.classList.add('drag-over');
    }
  };

  answerArea.ondragleave = () => {
    answerArea.classList.remove('drag-over');
  };

  answerArea.ondrop = e => {
    if (draggedFromAnswer) {
      return;
    }
    
    e.preventDefault();
    answerArea.classList.remove('drag-over');
    
    if (draggedElement) {
      if (!userAnswers[currentQuestion]) {
        userAnswers[currentQuestion] = [];
      }

      if (q.type === 'multiple_choice') {
        userAnswers[currentQuestion] = [draggedElement];
      } else {
        userAnswers[currentQuestion].push(draggedElement);
      }
      
      draggedElement = null;
      draggedFromAnswer = false;
      loadQuestion();
    }
  };

  document.getElementById('prevButton').disabled = currentQuestion === 0;
  document.getElementById('nextButton').textContent = currentQuestion === currentQuiz.length - 1 ? 'Submit' : 'Next';
}

document.getElementById('prevButton').addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
});

document.getElementById('nextButton').addEventListener('click', () => {
  if (currentQuestion < currentQuiz.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    submitQuiz();
  }
});

async function submitQuiz() {
  let correctCount = 0;
  let wrongCount = 0;
  const answersToSave = [];
  
  currentQuiz.forEach((q, idx) => {
    const userAns = userAnswers[idx];
    const correctAns = q.correct;
    const isCorrect = userAns && JSON.stringify(userAns) === JSON.stringify(correctAns);
    
    console.log(`Question ${idx + 1}:`, {
      questionId: q.id,
      userAnswer: userAns,
      correctAnswer: correctAns,
      match: isCorrect
    });
    
    if (isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
    }

    answersToSave.push({
      question_id: q.id,
      is_correct: isCorrect
    });
  });

  const totalQuestions = currentQuiz.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const userData = JSON.parse(localStorage.getItem('user'));
  
  if (userData && userData.id) {
    console.log('Saving quiz results to database...');
    
    const dataToInsert = answersToSave.map(ans => ({
      user_id: userData.id,
      question_id: ans.question_id, // Sekarang ini akan beda-beda per soal
      is_correct: ans.is_correct
    }));

    console.log('Data to insert:', dataToInsert);

    const { data, error } = await supabase
      .from('user_answers')
      .insert(dataToInsert);

    if (error) {
      console.error('Error saving quiz results:', error);
      alert('Failed to save quiz results: ' + error.message);
    } else {
      console.log('Quiz results saved successfully!', data);
    }
  } else {
    console.warn('No user logged in, cannot save results');
  }

  document.getElementById('quizContent').style.display = 'none';
  document.getElementById('resultCard').style.display = 'block';
  
  let resultMessage = '';
  let resultEmoji = '';
  
  if (percentage >= 80) {
    resultMessage = 'Excellent! 🎉';
    resultEmoji = '🌟';
  } else if (percentage >= 60) {
    resultMessage = 'Good Job! 👍';
    resultEmoji = '😊';
  } else if (percentage >= 40) {
    resultMessage = 'Keep Practicing! 💪';
    resultEmoji = '📚';
  } else {
    resultMessage = 'Need More Practice 📖';
    resultEmoji = '🔄';
  }

  document.getElementById('scoreDisplay').innerHTML = `
    <div style="font-size: 3rem; margin: 1rem 0;">${resultEmoji}</div>
    <div style="font-size: 2rem; font-weight: bold; color: #2c698d; margin: 1rem 0;">${percentage}%</div>
    <div style="font-size: 1.3rem; margin: 1rem 0;">${resultMessage}</div>
    <div style="margin-top: 1.5rem; font-size: 1.1rem;">
      <div style="margin: 0.5rem 0;">✅ Correct: <strong>${correctCount}</strong></div>
      <div style="margin: 0.5rem 0;">❌ Wrong: <strong>${wrongCount}</strong></div>
      <div style="margin: 0.5rem 0;">📊 Total: <strong>${totalQuestions}</strong></div>
    </div>
  `;
}

function backToSelection() {
  document.getElementById('resultCard').style.display = 'none';
  document.getElementById('quizSelection').style.display = 'block';
  currentQuiz = [];
  currentQuestion = 0;
  userAnswers = [];
  currentMaterialId = null;
}

document.getElementById('backButton').addEventListener('click', backToSelection);

window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;

loadQuizData().then((success) => {
  if (success) {
    const quizOptions = document.querySelectorAll('.quiz-option');
    console.log('Quiz options found:', quizOptions.length);
    
    quizOptions.forEach((option, index) => {
      option.addEventListener('click', () => {
        console.log('Quiz option clicked:', index + 1);
        startQuiz(index + 1);
      });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const materialId = urlParams.get('material');
    if (materialId) {
      console.log('Auto-starting quiz from URL:', materialId);
      startQuiz(parseInt(materialId));
    }
  }
});