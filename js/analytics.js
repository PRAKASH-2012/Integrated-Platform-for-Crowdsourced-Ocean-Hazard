/* ==========================================================================
   OceanShield AI - Chart.js & Social Media Sentiment Analytics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAnalyticsCharts();
  renderSocialAnalytics();
});

function initAnalyticsCharts() {
  if (typeof Chart === 'undefined') return;

  // Global Chart Styling Defaults for Dark Glassmorphism
  Chart.defaults.color = '#8b949e';
  Chart.defaults.font.family = 'Inter';

  // 1. Incident Trends (Line Chart)
  const trendsCtx = document.getElementById('chart-trends');
  if (trendsCtx) {
    new Chart(trendsCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Crowdsourced Hazard Reports',
          data: [320, 450, 680, 890, 1200, 1540, 2100, 2890],
          borderColor: '#00f2fe',
          backgroundColor: 'rgba(0, 242, 254, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }

  // 2. Hazard Breakdown (Doughnut Chart)
  const pieCtx = document.getElementById('chart-hazard-pie');
  if (pieCtx) {
    new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['High Waves', 'Cyclones', 'Oil Spills', 'Boat Distress', 'Coastal Erosion', 'Others'],
        datasets: [{
          data: [35, 25, 15, 12, 8, 5],
          backgroundColor: ['#00f2fe', '#ff3b30', '#ffb703', '#4facfe', '#a855f7', '#34c759']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // 3. District Risk Radar Chart
  const radarCtx = document.getElementById('chart-district-radar');
  if (radarCtx) {
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Swell Surge', 'Wind Gust', 'Inundation', 'Boat Activity', 'Pollution', 'Erosion'],
        datasets: [
          {
            label: 'Visakhapatnam',
            data: [90, 85, 70, 60, 45, 80],
            borderColor: '#ff3b30',
            backgroundColor: 'rgba(255, 59, 48, 0.2)'
          },
          {
            label: 'Chennai',
            data: [75, 60, 85, 75, 90, 65],
            borderColor: '#00f2fe',
            backgroundColor: 'rgba(0, 242, 254, 0.2)'
          }
        ]
      },
      options: { responsive: true }
    });
  }
}

function renderSocialAnalytics() {
  const socialData = Storage.getSocial();
  const feedContainer = document.getElementById('social-feed-container');
  const keywordsContainer = document.getElementById('trending-keywords-cloud');

  if (feedContainer && socialData.emergencyPosts) {
    feedContainer.innerHTML = socialData.emergencyPosts.map(p => `
      <div class="glass-card" style="padding: 1rem; margin-bottom: 0.85rem; border-left: 3px solid ${p.emergencyScore > 90 ? 'var(--color-critical)' : 'var(--cyan-primary)'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
          <span style="font-weight: 700; font-size: 0.85rem; color: var(--cyan-primary);">${p.platform} • ${p.author}</span>
          <span class="badge ${p.emergencyScore > 90 ? 'badge-critical' : 'badge-info'}">Emergency Score: ${p.emergencyScore}%</span>
        </div>
        <p style="font-size: 0.85rem; color: #fff; margin-bottom: 0.5rem;">${p.content}</p>
        <div style="font-size: 0.75rem; color: var(--text-dim); display: flex; justify-content: space-between;">
          <span>📍 ${p.location} (${p.timestamp})</span>
          <span><i class="fa-solid fa-heart"></i> ${p.likes} | <i class="fa-solid fa-retweet"></i> ${p.shares}</span>
        </div>
      </div>
    `).join('');
  }

  if (keywordsContainer && socialData.trendingKeywords) {
    keywordsContainer.innerHTML = socialData.trendingKeywords.map(k => `
      <span class="badge ${k.riskLevel === 'High' || k.riskLevel === 'Critical' ? 'badge-critical' : 'badge-info'}" style="font-size: 0.85rem; padding: 0.4rem 0.8rem; margin: 0.2rem;">
        ${k.word} (${k.count})
      </span>
    `).join('');
  }
}
