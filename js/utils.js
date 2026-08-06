/* ==========================================================================
   OceanShield AI - Utility Functions, Toast Notifications & i18n
   ========================================================================== */

// Toast System
function showToast(message, type = 'info', icon = 'fa-circle-info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = icon;
  if (type === 'critical' || type === 'error') iconClass = 'fa-triangle-exclamation';
  if (type === 'success') iconClass = 'fa-circle-check';
  if (type === 'warning') iconClass = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}" style="color: var(--cyan-primary); font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Text to Speech Assistant
function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop ongoing
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    showToast(`🔊 Voice Alert: "${text.substring(0, 40)}..."`, 'info');
  } else {
    showToast('Speech synthesis not supported on this browser', 'warning');
  }
}

// Animated Counter Utility
function animateCounter(elementId, targetNumber, duration = 1500) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  let start = 0;
  const stepTime = Math.abs(Math.floor(duration / targetNumber));
  const timer = setInterval(() => {
    start += 1;
    el.innerText = start;
    if (start >= targetNumber) {
      el.innerText = targetNumber;
      clearInterval(timer);
    }
  }, stepTime || 10);
}

// Formatter Helpers
function formatDate(dateString) {
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Multi-Language Dictionary (EN, TN, HI)
const I18N_DICT = {
  en: {
    heroTitle: "AI Powered Coastal Disaster Intelligence & Emergency Response Platform",
    tagline: "Integrated Crowdsourced Ocean Hazard Reporting & Social Media Analytics",
    reportHazard: "Report Ocean Hazard",
    liveMap: "Live GIS Map",
    activeAlerts: "Active Emergency Alerts",
    commandCenter: "Government Command Center",
    citizensHelped: "Citizens Protected",
    incidentsLogged: "Incidents Logged",
    aiAccuracy: "AI Accuracy Rate"
  },
  tn: {
    heroTitle: "செயற்கை நுண்ணறிவு கடலோர பேரிடர் நுண்ணறிவு மற்றும் அவசர உதவி மேடை",
    tagline: "ஒருங்கிணைக்கப்பட்ட கடல் ஆபத்து அறிக்கை மற்றும் சமூக ஊடக பகுப்பாய்வு",
    reportHazard: "கடல் ஆபத்தை புகாரளிக்கவும்",
    liveMap: "நேரலை GIS வரைபடம்",
    activeAlerts: "செயலில் உள்ள அவசர எச்சரிக்கைகள்",
    commandCenter: "அரசு கட்டளை மையம்",
    citizensHelped: "பாதுகாக்கப்பட்ட மக்கள்",
    incidentsLogged: "பதிவு செய்யப்பட்ட சம்பவங்கள்",
    aiAccuracy: "AI துல்லியம்"
  },
  hi: {
    heroTitle: "एआई संचालित तटीय आपदा बुद्धिमत्ता और आपातकालीन प्रतिक्रिया मंच",
    tagline: "एककृत महासागर खतरा रिपोर्टिंग और सोशल मीडिया विश्लेषण",
    reportHazard: "समुद्री खतरे की रिपोर्ट करें",
    liveMap: "लाइव जीआईएस मानचित्र",
    activeAlerts: "सक्रिय आपातकालीन चेतावनियाँ",
    commandCenter: "सरकारी कमान केंद्र",
    citizensHelped: "सुरक्षित नागरिक",
    incidentsLogged: "दर्ज की गई घटनाएं",
    aiAccuracy: "एआई सटीकता दर"
  }
};

function changeLanguage(langCode) {
  localStorage.setItem(STORAGE_KEYS.LANG, langCode);
  const dict = I18N_DICT[langCode] || I18N_DICT.en;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });

  showToast(`Language switched to ${langCode.toUpperCase()}`, 'info');
}
