/* ==========================================================================
   OceanShield AI - LocalStorage State & Data Hydration Engine
   ========================================================================== */

const STORAGE_KEYS = {
  HAZARDS: 'oceanShield_hazards',
  REPORTS: 'oceanShield_reports',
  USERS: 'oceanShield_users',
  ALERTS: 'oceanShield_alerts',
  WEATHER: 'oceanShield_weather',
  NEWS: 'oceanShield_news',
  RESCUE: 'oceanShield_rescue',
  SOCIAL: 'oceanShield_social',
  CURRENT_USER: 'oceanShield_currentUser',
  THEME: 'oceanShield_theme',
  LANG: 'oceanShield_lang'
};

class StorageEngine {
  constructor() {
    this.init();
  }

  async init() {
    // Check if initial datasets are seeded in LocalStorage
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      await this.seedAllData();
    }
  }

  async seedAllData() {
    try {
      const [hazardsRes, reportsRes, usersRes, alertsRes, weatherRes, newsRes, rescueRes, socialRes] = await Promise.all([
        fetch('json/hazards.json').then(r => r.json()),
        fetch('json/reports.json').then(r => r.json()),
        fetch('json/users.json').then(r => r.json()),
        fetch('json/alerts.json').then(r => r.json()),
        fetch('json/weather.json').then(r => r.json()),
        fetch('json/news.json').then(r => r.json()),
        fetch('json/rescue.json').then(r => r.json()),
        fetch('json/social.json').then(r => r.json())
      ]);

      localStorage.setItem(STORAGE_KEYS.HAZARDS, JSON.stringify(hazardsRes));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reportsRes));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersRes));
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alertsRes));
      localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(weatherRes));
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newsRes));
      localStorage.setItem(STORAGE_KEYS.RESCUE, JSON.stringify(rescueRes));
      localStorage.setItem(STORAGE_KEYS.SOCIAL, JSON.stringify(socialRes));

      // Default active user: Citizen
      if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(usersRes[0]));
      }

      console.log('✅ OceanShield AI Data Seeded Successfully into LocalStorage.');
    } catch (err) {
      console.warn('Fallback: Hydrating memory data if fetch fails.', err);
    }
  }

  // Getters & Setters
  getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getHazards() { return this.getData(STORAGE_KEYS.HAZARDS); }
  getReports() { return this.getData(STORAGE_KEYS.REPORTS); }
  getUsers() { return this.getData(STORAGE_KEYS.USERS); }
  getAlerts() { return this.getData(STORAGE_KEYS.ALERTS); }
  getWeather() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.WEATHER) || '{}'); }
  getNews() { return this.getData(STORAGE_KEYS.NEWS); }
  getRescue() { return this.getData(STORAGE_KEYS.RESCUE); }
  getSocial() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.SOCIAL) || '{}'); }
  getCurrentUser() { 
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'); 
  }

  saveReport(newReport) {
    const reports = this.getReports();
    reports.unshift(newReport);
    this.setData(STORAGE_KEYS.REPORTS, reports);
    return reports;
  }

  updateReport(reportId, updatedFields) {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === reportId);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updatedFields };
      this.setData(STORAGE_KEYS.REPORTS, reports);
    }
    return reports;
  }

  setCurrentUser(user) {
    this.setData(STORAGE_KEYS.CURRENT_USER, user);
  }

  resetData() {
    localStorage.clear();
    location.reload();
  }
}

const Storage = new StorageEngine();
