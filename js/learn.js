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

const materials = [
  {
    id: 1,
    title: "Engaging Your Audience and Drafting",
    pdfFile: "Engaging-Your-Audience-and-Drafting-Openers.pdf",
    videoUrl: "https://www.youtube.com/embed/oTe4f-bBEKg",
    description: "Learn how to engage your audience effectively and draft compelling openings and closings."
  },
  {
    id: 2,
    title: "Visual Aids and Drafting Body of Presentation",
    pdfFile: "Visual-Aids-and-Drafting-Body-of-Presentation.pdf",
    videoUrl: "https://www.youtube.com/embed/NiKtZgImdlY",
    description: "Master the art of using visual aids and structuring the body of your presentation."
  },
  {
    id: 3,
    title: "Handling Questions and Body Language",
    pdfFile: "Handling-Questions-and-Body-Language.pdf",
    videoUrl: ["https://www.youtube.com/embed/Y1qDNTG9lg0", "https://www.youtube.com/embed/V8eLdbKXGzk"],
    description: "Develop skills in handling questions and using effective body language."
  },
  {
    id: 4,
    title: "Delivery Techniques - Drafting Conclusion",
    pdfFile: "Delivery-Techniques--Drafting-Conclusion-and-Writing-a-Process.pdf",
    videoUrl: null,
    description: "Learn delivery techniques and how to craft powerful conclusions and summaries."
  }
];

let currentMaterial = null;

function showMaterial(id) {
  currentMaterial = materials.find(m => m.id === id);
  document.getElementById('mainView').classList.add('hidden');
  document.getElementById('detailView').classList.add('active');
  document.getElementById('detailTitle').textContent = currentMaterial.title;
  document.getElementById('detailDescription').textContent = currentMaterial.description;

  // Hide action buttons
  document.getElementById('actionButtons').innerHTML = '';

  // Show PDF directly
  document.getElementById('pdfFileName').textContent = currentMaterial.pdfFile;
  const pdfFrame = document.getElementById('pdfFrame');
  pdfFrame.src = 'materials/' + currentMaterial.pdfFile;
  document.getElementById('pdfViewer').classList.add('active');

  // Show videos if available
  const hasVideo = currentMaterial.videoUrl !== null;
  hasVideo ? displayVideos() : document.getElementById('videoSection').innerHTML = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPdf() {
  document.getElementById('pdfFileName').textContent = currentMaterial.pdfFile;
  const pdfFrame = document.getElementById('pdfFrame');
  pdfFrame.src = 'materials/' + currentMaterial.pdfFile;
  document.getElementById('pdfViewer').classList.add('active');
  setTimeout(() => {
    pdfFrame.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function displayVideos() {
  const videoSection = document.getElementById('videoSection');
  const videos = Array.isArray(currentMaterial.videoUrl)
    ? currentMaterial.videoUrl : [currentMaterial.videoUrl];
  let html = `<div class="video-section"><h3>Video Tutorial${videos.length>1?'s':''}</h3>`;
  videos.forEach((v, i) => {
    html += `
      ${videos.length>1?`<h4 class="video-title">Video Part ${i+1}</h4>`:''}
      <div class="video-container"><iframe src="${v}" allowfullscreen></iframe></div>`;
  });
  html += '</div>';
  videoSection.innerHTML = html;
}

function backToMain() {
  document.getElementById('mainView').classList.remove('hidden');
  document.getElementById('detailView').classList.remove('active');
  document.getElementById('pdfViewer').classList.remove('active');
  currentMaterial = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToQuiz() {
  if (currentMaterial)
    window.location.href = 'quiz.html?material=' + currentMaterial.id;
  else
    window.location.href = 'quiz.html';
}
