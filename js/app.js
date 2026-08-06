/* ==========================================================================
   OceanShield AI - App Engine, Theme Manager & UI Lifecycle
   ========================================================================== */

const AVAILABLE_THEMES = ['dark', 'ocean', 'light', 'sunrise'];

document.addEventListener('DOMContentLoaded', () => {
  // Hide splash loading screen after load
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => splash.remove(), 500);
    }
  }, 700);

  // Initialize Theme
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  const initialTheme = AVAILABLE_THEMES.includes(savedTheme) ? savedTheme : 'dark';
  setTheme(initialTheme);

  // Bind theme toggle buttons
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const currentIndex = AVAILABLE_THEMES.indexOf(current);
      const next = AVAILABLE_THEMES[(currentIndex + 1) % AVAILABLE_THEMES.length];
      setTheme(next);
    });
  }

  // Bind Accessibility contrast toggle
  const accessBtn = document.getElementById('accessibility-toggle-btn');
  if (accessBtn) {
    accessBtn.addEventListener('click', () => {
      document.body.classList.toggle('accessibility-contrast');
      showToast('Accessibility High-Contrast Mode Toggled', 'info');
    });
  }

  // Mobile Menu drawer toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Update navbar active state based on URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Hydrate user profile in navbar if present
  renderNavbarUser();
});

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  const icon = document.querySelector('#theme-toggle-btn i');
  if (icon) {
    switch (theme) {
      case 'ocean':
        icon.className = 'fa-solid fa-water';
        break;
      case 'sunrise':
        icon.className = 'fa-solid fa-cloud-sun';
        break;
      case 'light':
        icon.className = 'fa-solid fa-moon';
        break;
      default:
        icon.className = 'fa-solid fa-sun';
    }
  }
}

function renderNavbarUser() {
  const user = Auth.currentUser;
  const userContainer = document.getElementById('nav-user-profile');
  if (userContainer && user) {
    userContainer.innerHTML = `
      <div class="user-profile-badge">
        <img src="${user.avatar}" class="avatar-img" alt="${user.name}" style="width: 34px; height: 34px;">
        <div class="user-info-text" style="display: flex; flex-direction: column;">
          <span style="font-size: 0.85rem; font-weight: 700;">${user.name}</span>
          <span class="badge badge-info" style="font-size: 0.65rem; padding: 1px 6px;">${user.role}</span>
        </div>
        <button onclick="Auth.logout()" class="btn btn-outline btn-sm" title="Logout">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    `;
  }
}
