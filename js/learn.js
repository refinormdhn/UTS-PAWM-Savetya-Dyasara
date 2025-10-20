const profileIcon = document.getElementById('profileIcon');
const logoutModal = document.getElementById('logoutModal');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

profileIcon.addEventListener('click', () => {
  const user = localStorage.getItem('user');
  if (user) logoutModal.classList.add('active');
  else window.location.href = 'login.html';
});

cancelLogout.addEventListener('click', () => logoutModal.classList.remove('active'));
confirmLogout.addEventListener('click', () => {
  localStorage.removeItem('user');
  alert('You have been logged out successfully!');
  window.location.href = 'login.html';
});

const materials = [
  { id: 1, title: "Engaging Your Audience and Drafting", pdfFile: "Engaging-Your-Audience-and-Drafting-Opening-and-Closing.pdf", videoUrl: "https://www.youtube.com/embed/oTe4f-bBEKg", description: "Learn how to engage your audience effectively and draft compelling openings and closings for your presentations." },
  { id: 2, title: "Visual Aids and Drafting Body of Presentation", pdfFile: "Visual-Aids-and-Drafting-Body-of-Presentation.pdf", videoUrl: "https://www.youtube.com/embed/NiKtZgImdlY", description: "Master the art of using visual aids and structuring the body of your presentation." },
  { id: 3, title: "Handling Questions and Body Language", pdfFile: "Handling-Questions-and-Body-Language.pdf", videoUrl: ["https://www.youtube.com/embed/Y1qDNTG9lg0","https://www.youtube.com/embed/V8eLdbKXGzk"], description: "Develop skills in handling questions professionally and using effective body language." },
  { id: 4, title: "Delivery Techniques - Drafting Conclusion", pdfFile: "Delivery-Techniques--Drafting-Conclusion-and-Summary.pdf", videoUrl: null, description: "Learn delivery techniques and how to craft powerful conclusions and summaries." }
];

const materialsGrid = document.getElementById('materialsGrid');
materials.forEach(m => {
  const card = document.createElement('div');
  card.className = 'material-card';
  card.innerHTML = `
    <div class="material-header"><h3>${m.title}</h3></div>
    <p>${m.description}</p>
    <div class="material-footer"><span>View Material</span></div>
  `;
  card.onclick = () => showMaterial(m.id);
  materialsGrid.appendChild(card);
});

let currentMaterial = null;

function showMaterial(id) {
  currentMaterial = materials.find(m => m.id === id);
  document.getElementById('mainView').classList.add('hidden');
  document.getElementById('detailView').classList.add('active');
  document.getElementById('detailTitle').textContent = currentMaterial.title;
  document.getElementById('detailDescription').textContent = currentMaterial.description;
  renderActionButtons();
}

function renderActionButtons() {
  const actionButtons = document.getElementById('actionButtons');
  const hasVideo = currentMaterial.videoUrl !== null;
  actionButtons.className = hasVideo ? 'action-buttons' : 'action-buttons single';

  let videoBtn = '';
  if (hasVideo) {
    const plural = Array.isArray(currentMaterial.videoUrl);
    videoBtn = `<div class="action-btn video-btn" onclick="displayVideos()">🎥 ${plural ? 'Video Tutorials' : 'Video Tutorial'}</div>`;
  }

  actionButtons.innerHTML = `
    <div class="action-btn" onclick="showPdf()">📄 View PDF Material</div>
    ${videoBtn}
  `;
}

function showPdf() {
  const pdf = document.getElementById('pdfViewer');
  document.getElementById('pdfFileName').textContent = currentMaterial.pdfFile;
  pdf.classList.add('active');
}

function displayVideos() {
  const videoSection = document.getElementById('videoSection');
  const urls = Array.isArray(currentMaterial.videoUrl)
    ? currentMaterial.videoUrl
    : [currentMaterial.videoUrl];

  let html = `<div class="video-section"><h3>Video Tutorial${urls.length > 1 ? 's' : ''}</h3>`;
  urls.forEach((u, i) => {
    html += `<div class="video-container"><iframe src="${u}" allowfullscreen></iframe></div>`;
  });
  html += `</div>`;
  videoSection.innerHTML = html;
}

document.getElementById('backButton').onclick = () => {
  document.getElementById('detailView').classList.remove('active');
  document.getElementById('mainView').classList.remove('hidden');
  document.getElementById('pdfViewer').classList.remove('active');
  document.getElementById('videoSection').innerHTML = '';
  currentMaterial = null;
};

document.getElementById('quizButton').onclick = () => {
  if (currentMaterial) window.location.href = `quiz.html?material=${currentMaterial.id}`;
};
