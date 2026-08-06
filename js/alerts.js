/* ==========================================================================
   OceanShield AI - Emergency SOS & Broadcast Alert Engine
   ========================================================================== */

let sosCountdownTimer = null;
let sosSecondsRemaining = 5;

function triggerEmergencySOS() {
  injectSOSModal();
  const modal = document.getElementById('sos-modal');
  modal.style.display = 'block';

  sosSecondsRemaining = 5;
  document.getElementById('sos-countdown-num').innerText = sosSecondsRemaining;

  speakText("Warning! Emergency S O S Triggered. Countdown initiated.");

  sosCountdownTimer = setInterval(() => {
    sosSecondsRemaining -= 1;
    document.getElementById('sos-countdown-num').innerText = sosSecondsRemaining;

    if (sosSecondsRemaining <= 0) {
      clearInterval(sosCountdownTimer);
      executeSOSBroadcast();
    }
  }, 1000);
}

function cancelSOS() {
  if (sosCountdownTimer) clearInterval(sosCountdownTimer);
  const modal = document.getElementById('sos-modal');
  if (modal) modal.style.display = 'none';
  showToast('Emergency SOS Cancelled by User', 'info');
}

function executeSOSBroadcast() {
  const modal = document.getElementById('sos-modal');
  if (modal) modal.style.display = 'none';

  const user = Auth.currentUser || { name: 'Aarav Sharma', phone: '+91 98765 43210' };
  
  showToast(`🚨 CRITICAL SOS BROADCAST: Live GPS Sent to Coast Guard & NDRF!`, 'critical', 'fa-tower-broadcast');
  speakText("Emergency distress signal transmitted to nearest Coast Guard command.");

  // Add emergency report to storage
  const sosReport = {
    id: `SOS-DISTRESS-${Date.now().toString().slice(-4)}`,
    hazardType: "boat_accident",
    hazardName: "1-Click Citizen Emergency SOS",
    reporter: user.name,
    reporterRole: "Citizen",
    locationName: "Offshore Marina Beach Coast",
    lat: 13.0475,
    lng: 80.2824,
    district: "Chennai",
    state: "Tamil Nadu",
    severity: "Critical",
    description: `EMERGENCY SOS DISTRESS SIGNAL triggered by ${user.name} (${user.phone}). Immediate rescue boat required!`,
    status: "In Progress",
    verificationScore: 100,
    aiConfidence: 100,
    duplicateDetected: false,
    timestamp: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
    rescueAssigned: "CG-ALPHA",
    timeline: [
      { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: "1-Click SOS Signal Triggered" },
      { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: "GPS Sat Lock Verified & Pushed to Coast Guard" }
    ]
  };

  Storage.saveReport(sosReport);
}

function injectSOSModal() {
  if (document.getElementById('sos-modal')) return;

  const modalHTML = `
    <div id="sos-modal" class="glass-card" style="display: none; position: fixed; inset: 0; margin: auto; width: 90%; max-width: 420px; height: fit-content; padding: 2rem; z-index: 10005; background: rgba(15, 3, 3, 0.95); border: 2px solid var(--color-critical); text-align: center; box-shadow: var(--shadow-critical);">
      <i class="fa-solid fa-triangle-exclamation pulse-beacon critical" style="font-size: 3rem; margin-bottom: 1rem;"></i>
      <h2 style="color: var(--color-critical); font-size: 1.6rem; margin-bottom: 0.5rem;">EMERGENCY S.O.S TRIGGERED</h2>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">Broadcasting live GPS coordinates to Indian Coast Guard & Disaster Relief Teams in:</p>

      <div style="font-size: 4rem; font-weight: 900; color: var(--color-critical); line-height: 1; margin-bottom: 1.5rem;" id="sos-countdown-num">5</div>

      <div style="display: flex; gap: 1rem;">
        <button onclick="cancelSOS()" class="btn btn-outline" style="flex: 1; border-color: #fff; color: #fff;">Cancel Signal</button>
        <button onclick="executeSOSBroadcast()" class="btn btn-danger" style="flex: 1;">Send Now!</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Government Officer Emergency Broadcast Trigger Modal
function triggerEmergencyBroadcastModal() {
  const title = prompt("Enter Alert Headline:", "RED ALERT: Severe Cyclone Swell Warning");
  const district = prompt("Enter Target Coastal District:", "Visakhapatnam & North AP Coast");

  if (title && district) {
    const newAlert = {
      id: `ALT-${Math.floor(900 + Math.random() * 99)}`,
      level: "Red",
      title: title,
      district: district,
      issuedBy: "NDMA Emergency Command",
      timestamp: new Date().toISOString(),
      instructions: "Immediate evacuation ordered. All maritime activity prohibited.",
      affectedPopulation: 650000
    };

    const alerts = Storage.getAlerts();
    alerts.unshift(newAlert);
    Storage.setData(STORAGE_KEYS.ALERTS, alerts);

    showToast(`🚨 RED EMERGENCY BROADCAST DISPATCHED TO ${district}!`, 'critical', 'fa-tower-broadcast');
    speakText(`Attention! Emergency Warning issued for ${district}. Please take shelter immediately.`);
  }
}
