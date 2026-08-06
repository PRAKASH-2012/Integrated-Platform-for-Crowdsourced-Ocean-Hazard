/* ==========================================================================
   OceanShield AI - Oceanography & Coastal Weather Simulator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderPortWeather();
});

function renderPortWeather() {
  const weatherData = Storage.getWeather();
  const select = document.getElementById('weather-port-select');
  const cardContainer = document.getElementById('weather-details-card');

  if (!cardContainer || !weatherData.ports) return;

  if (select) {
    select.innerHTML = weatherData.ports.map((p, idx) => `
      <option value="${idx}">${p.name}</option>
    `).join('');

    select.addEventListener('change', (e) => {
      updatePortDisplay(weatherData.ports[e.target.value]);
    });
  }

  updatePortDisplay(weatherData.ports[0]);
}

function updatePortDisplay(port) {
  const cardContainer = document.getElementById('weather-details-card');
  if (!cardContainer) return;

  cardContainer.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
      <div class="glass-card" style="padding: 1.2rem; text-align: center;">
        <i class="fa-solid fa-water text-gradient" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <h3 style="font-size: 1.8rem; margin: 0.2rem 0;">${port.waveHeightM} m</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Wave Swell Height</p>
      </div>

      <div class="glass-card" style="padding: 1.2rem; text-align: center;">
        <i class="fa-solid fa-wind text-gradient" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <h3 style="font-size: 1.8rem; margin: 0.2rem 0;">${port.windKmh} km/h</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Wind Speed (${port.windDirection})</p>
      </div>

      <div class="glass-card" style="padding: 1.2rem; text-align: center;">
        <i class="fa-solid fa-temperature-full text-gradient" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <h3 style="font-size: 1.8rem; margin: 0.2rem 0;">${port.seaTempC}°C</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Ocean Surface Temp</p>
      </div>

      <div class="glass-card" style="padding: 1.2rem; text-align: center;">
        <i class="fa-solid fa-gauge text-gradient" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <h3 style="font-size: 1.8rem; margin: 0.2rem 0;">${port.pressureMb} hPa</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Atmospheric Pressure</p>
      </div>
    </div>

    <div class="glass-card" style="padding: 1.25rem; margin-top: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <h4 style="color: var(--cyan-primary);"><i class="fa-solid fa-moon"></i> Port Tide Forecast</h4>
        <p style="font-size: 0.9rem; color: var(--text-main); margin-top: 0.2rem;">${port.tide}</p>
      </div>
      <span class="badge ${port.waveHeightM > 4 ? 'badge-critical' : 'badge-info'}">
        ${port.waveHeightM > 4 ? 'Rough Sea Advisory' : 'Moderate Sea'}
      </span>
    </div>
  `;
}
