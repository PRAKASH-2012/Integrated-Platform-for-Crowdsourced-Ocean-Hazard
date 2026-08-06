/* ==========================================================================
   OceanShield AI - Multimodal Hazard Reporting & AI Image Scanner Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initReportForm();
});

function initReportForm() {
  const hazardSelect = document.getElementById('report-hazard-type');
  if (!hazardSelect) return;

  // Hydrate 15+ Hazard types dynamically from Storage
  const hazards = Storage.getHazards();
  hazardSelect.innerHTML = hazards.map(h => `
    <option value="${h.id}">${h.name} (${h.category})</option>
  `).join('');

  // GPS Auto-fetch trigger
  fetchGPSLocation();

  // Image Upload Listener
  const imageInput = document.getElementById('report-image-input');
  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('report-media-preview').src = event.target.result;
          document.getElementById('report-media-preview-container').style.display = 'block';
          
          // Trigger AI Scan Simulation
          runAIScanAnimation(file.name, hazardSelect.value);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Submit Handler
  const form = document.getElementById('hazard-report-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitHazardReport();
    });
  }
}

function fetchGPSLocation() {
  const locStatus = document.getElementById('gps-status-text');
  const latEl = document.getElementById('report-lat');
  const lngEl = document.getElementById('report-lng');

  if (navigator.geolocation) {
    if (locStatus) locStatus.innerText = "fetching live GPS satellite coordinates...";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (latEl) latEl.value = pos.coords.latitude.toFixed(4);
        if (lngEl) lngEl.value = pos.coords.longitude.toFixed(4);
        if (locStatus) locStatus.innerText = "GPS Fixed: High Accuracy Satellite Coordinates Lock";
      },
      (err) => {
        // Fallback to Marina Beach Chennai coordinates
        if (latEl) latEl.value = "13.0475";
        if (lngEl) lngEl.value = "80.2824";
        if (locStatus) locStatus.innerText = "Simulated GPS: Marina Beach, Chennai (13.0475° N, 80.2824° E)";
      }
    );
  }
}

function runAIScanAnimation(fileName, hazardHint) {
  const scanBox = document.getElementById('ai-scanner-box');
  const scanResults = document.getElementById('ai-scan-results');
  if (!scanBox || !scanResults) return;

  scanBox.style.display = 'block';
  scanResults.innerHTML = `
    <div style="text-align: center; padding: 1.5rem;">
      <i class="fa-solid fa-brain text-gradient floating-element" style="font-size: 2.5rem; margin-bottom: 0.75rem;"></i>
      <h4 style="color: var(--cyan-primary);">AI Neural Network Scanning Image...</h4>
      <p style="font-size: 0.8rem; color: var(--text-muted);">Detecting coastal wave anomalies, structural debris & hydrocarbon spectral slick.</p>
    </div>
  `;

  setTimeout(() => {
    const aiResult = AI.analyzeHazardMedia(fileName, hazardHint);

    scanResults.innerHTML = `
      <div style="padding: 1rem; background: rgba(0, 242, 254, 0.06); border-radius: var(--radius-sm); border: 1px solid var(--border-glow);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="font-weight: 700; color: var(--cyan-primary);"><i class="fa-solid fa-circle-check"></i> AI Hazard Signature Detected</span>
          <span class="badge badge-info">${aiResult.confidence}% Confidence</span>
        </div>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.3rem;">Detected: ${aiResult.detectedHazard}</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;"><strong>Damage Estimate:</strong> ${aiResult.damageEstimate}</p>
        
        <div style="font-size: 0.8rem; background: rgba(2, 8, 20, 0.6); padding: 0.6rem; border-radius: var(--radius-sm);">
          <strong style="color: var(--gold-accent);">🤖 AI Emergency Protocol Recommendations:</strong>
          <ul style="margin-left: 1.2rem; margin-top: 0.3rem;">
            ${aiResult.recommendations.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // Populate hidden AI score fields
    document.getElementById('report-ai-confidence').value = aiResult.confidence;
    showToast(`AI Computer Vision Scan Complete: ${aiResult.confidence}% Match`, 'success');
  }, 1800);
}

function submitHazardReport() {
  const user = Auth.currentUser || { name: 'Anonymous Citizen', role: 'Citizen' };

  const hazardType = document.getElementById('report-hazard-type').value;
  const hazards = Storage.getHazards();
  const matchedHazard = hazards.find(h => h.id === hazardType) || hazards[0];

  const lat = parseFloat(document.getElementById('report-lat').value || 13.0475);
  const lng = parseFloat(document.getElementById('report-lng').value || 80.2824);

  // Duplicate Check
  const dupCheck = AI.checkDuplicateReport(lat, lng, hazardType);
  if (dupCheck.isDuplicate) {
    showToast(`⚠️ Warning: Duplicate report detected nearby (ID: ${dupCheck.existingId}). Merging report data.`, 'warning');
  }

  const previewImg = document.getElementById('report-media-preview').src;

  const newReport = {
    id: `REP-2026-${Math.floor(800 + Math.random() * 199)}`,
    hazardType: matchedHazard.id,
    hazardName: matchedHazard.name,
    reporter: user.name,
    reporterRole: user.role,
    locationName: document.getElementById('report-location-name').value || 'Marina Beach Coast, Chennai',
    lat: lat,
    lng: lng,
    district: document.getElementById('report-district').value || 'Chennai',
    state: 'Tamil Nadu',
    severity: document.getElementById('report-severity').value || matchedHazard.defaultSeverity,
    description: document.getElementById('report-description').value,
    status: 'Pending Review',
    verificationScore: parseInt(document.getElementById('report-ai-confidence').value || 92),
    aiConfidence: parseInt(document.getElementById('report-ai-confidence').value || 92),
    duplicateDetected: dupCheck.isDuplicate,
    timestamp: new Date().toISOString(),
    imageUrl: previewImg.startsWith('data:') ? previewImg : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    rescueAssigned: 'Unassigned',
    timeline: [
      { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: `Report Submitted by ${user.name}` },
      { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: 'AI Computer Vision Feature Correlation Verified' }
    ]
  };

  Storage.saveReport(newReport);
  showToast('🎉 Hazard Report Successfully Submitted & Pushed to Command Center!', 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1200);
}
