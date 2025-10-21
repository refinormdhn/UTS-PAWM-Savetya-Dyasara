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
  localStorage.removeItem('user');
  alert('You have been logged out successfully!');
  window.location.href = 'login.html';
}

document.getElementById('logoutModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLogoutModal();
});

const quizData = {
  1: [
    {
      question: "What is the first step in engaging your audience?",
      options: ["Understanding audience needs", "Starting with a joke", "Reading from slides", "Avoiding eye contact"],
      correct: ["Understanding audience needs", "Starting with a joke"]
    },
    {
      question: "Order the steps for a good presentation opening:",
      options: ["Hook", "Introduction", "Agenda", "Main content"],
      correct: ["Hook", "Introduction", "Agenda", "Main content"]
    }
  ],
  2: [
    {
      question: "What makes an effective visual aid?",
      options: ["Simple and clear", "Text-heavy slides", "Complex graphs", "Minimal text"],
      correct: ["Simple and clear", "Minimal text"]
    },
    {
      question: "Order the presentation structure:",
      options: ["Introduction", "Body", "Conclusion", "Q&A"],
      correct: ["Introduction", "Body", "Conclusion", "Q&A"]
    }
  ],
  3: [
    {
      question: "Best practices for handling questions:",
      options: ["Listen carefully", "Interrupt quickly", "Acknowledge the question", "Guess the answer"],
      correct: ["Listen carefully", "Acknowledge the question"]
    },
    {
      question: "Effective body language includes:",
      options: ["Eye contact", "Slouching", "Open gestures", "Crossed arms"],
      correct: ["Eye contact", "Open gestures"]
    }
  ],
  4: [
    {
      question: "Key delivery techniques:",
      options: ["Clear voice", "Monotone speech", "Appropriate pace", "Rushing through"],
      correct: ["Clear voice", "Appropriate pace"]
    },
    {
      question: "Order conclusion elements:",
      options: ["Summary", "Call to action", "Final thanks", "New information"],
      correct: ["Summary", "Call to action", "Final thanks"]
    }
  ]
};

let currentQuiz = [];
let currentQuestion = 0;
let userAnswers = [];
let draggedElement = null;

function startQuiz(materialId) {
  const urlParams = new URLSearchParams(window.location.search);
  const paramMaterial = urlParams.get('material');
  
  if (paramMaterial) {
    materialId = parseInt(paramMaterial);
  }

  currentQuiz = quizData[materialId] || quizData[1];
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

  answerArea.innerHTML = userAnswers[currentQuestion] 
    ? userAnswers[currentQuestion].map(ans => `<div class="option filled">${ans}</div>`).join('')
    : '<span style="color:#888">Drag options here to order your answer</span>';

  optionsContainer.innerHTML = '';
  q.options.forEach(opt => {
    if (!userAnswers[currentQuestion] || !userAnswers[currentQuestion].includes(opt)) {
      const div = document.createElement('div');
      div.className = 'option';
      div.textContent = opt;
      div.draggable = true;
      
      div.addEventListener('dragstart', e => {
        draggedElement = opt;
        e.dataTransfer.effectAllowed = 'move';
      });
      
      optionsContainer.appendChild(div);
    }
  });

  answerArea.ondragover = e => {
    e.preventDefault();
    answerArea.classList.add('drag-over');
  };

  answerArea.ondragleave = () => {
    answerArea.classList.remove('drag-over');
  };

  answerArea.ondrop = e => {
    e.preventDefault();
    answerArea.classList.remove('drag-over');
    
    if (draggedElement) {
      if (!userAnswers[currentQuestion]) {
        userAnswers[currentQuestion] = [];
      }
      userAnswers[currentQuestion].push(draggedElement);
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

function submitQuiz() {
  let score = 0;
  currentQuiz.forEach((q, idx) => {
    const userAns = userAnswers[idx];
    if (userAns && JSON.stringify(userAns) === JSON.stringify(q.correct)) {
      score++;
    }
  });

  document.getElementById('quizContent').style.display = 'none';
  document.getElementById('resultCard').style.display = 'block';
  document.getElementById('scoreDisplay').textContent = `${score} / ${currentQuiz.length}`;
}

function backToSelection() {
  document.getElementById('resultCard').style.display = 'none';
  document.getElementById('quizSelection').style.display = 'block';
  currentQuiz = [];
  currentQuestion = 0;
  userAnswers = [];
}

const urlParams = new URLSearchParams(window.location.search);
const materialId = urlParams.get('material');
if (materialId) {
  startQuiz(parseInt(materialId));
}

window.startQuiz = startQuiz;
window.backToSelection = backToSelection;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;