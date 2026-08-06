/* ==========================================================================
   OceanShield AI - Role-Based Dashboard Renderer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderDashboardView();
});

function renderDashboardView() {
  const user = Auth.currentUser || Storage.getUsers()[0];
  const container = document.getElementById('dashboard-content-area');
  if (!container) return;

  // Hydrate Header info
  const headerRoleEl = document.getElementById('dashboard-active-role');
  if (headerRoleEl) headerRoleEl.innerText = `${user.role} Hub`;

  const reports = Storage.getReports();
  const alerts = Storage.getAlerts();
  const rescueTeams = Storage.getRescue();

  let viewHTML = '';

  if (user.role === 'Citizen') {
    viewHTML = renderCitizenDashboard(user, reports, alerts);
  } else if (user.role === 'Government Officer') {
    viewHTML = renderGovernmentDashboard(user, reports, alerts, rescueTeams);
  } else if (user.role === 'Rescue Team') {
    viewHTML = renderRescueDashboard(user, reports, rescueTeams);
  } else if (user.role === 'Admin') {
    viewHTML = renderAdminDashboard(user, reports, alerts);
  }

  container.innerHTML = viewHTML;
}

// --------------------------------------------------------------------------
// 1. Citizen Dashboard
// --------------------------------------------------------------------------
function renderCitizenDashboard(user, reports, alerts) {
  const myReports = reports.filter(r => r.reporter === user.name || r.reporterRole === 'Citizen');

  return `
    <!-- Top Stats -->
    <div class="stats-grid">
      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>${user.points || 450}</h3>
          <p>Volunteer Points</p>
        </div>
        <i class="fa-solid fa-award stat-icon" style="color: var(--gold-accent);"></i>
      </div>

      <div class="glass-card stat-card success">
        <div class="stat-info">
          <h3>${user.badge || 'Coastal Guardian'}</h3>
          <p>Citizen Rank</p>
        </div>
        <i class="fa-solid fa-shield-cat stat-icon"></i>
      </div>

      <div class="glass-card stat-card warning">
        <div class="stat-info">
          <h3>${myReports.length}</h3>
          <p>My Hazards Reported</p>
        </div>
        <i class="fa-solid fa-camera stat-icon"></i>
      </div>

      <div class="glass-card stat-card critical">
        <div class="stat-info">
          <h3>${alerts.filter(a => a.level === 'Red' || a.level === 'Orange').length}</h3>
          <p>Active District Alerts</p>
        </div>
        <i class="fa-solid fa-bell stat-icon"></i>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="dashboard-grid">
      
      <!-- Quick Action Center & My Reports -->
      <div class="glass-card command-panel">
        <div class="panel-header">
          <h3 class="panel-title"><i class="fa-solid fa-rocket text-gradient"></i> Citizen Quick Actions</h3>
        </div>

        <div class="action-tiles-grid" style="margin-bottom: 2rem;">
          <a href="report.html" class="action-tile">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Report Hazard</span>
          </a>
          <a href="map.html" class="action-tile">
            <i class="fa-solid fa-map-location-dot"></i>
            <span>Find Safe Shelter</span>
          </a>
          <button onclick="triggerEmergencySOS()" class="action-tile" style="border-color: var(--color-critical); background: rgba(255, 59, 48, 0.1);">
            <i class="fa-solid fa-sos" style="color: var(--color-critical);"></i>
            <span style="color: var(--color-critical);">1-Click SOS</span>
          </button>
          <a href="community.html" class="action-tile">
            <i class="fa-solid fa-users"></i>
            <span>Community Feed</span>
          </a>
        </div>

        <div class="panel-header">
          <h3 class="panel-title"><i class="fa-solid fa-clock-rotate-left"></i> My Recent Hazard Reports</h3>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Hazard</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>AI Conf.</th>
              </tr>
            </thead>
            <tbody>
              ${myReports.map(r => `
                <tr>
                  <td><strong>${r.id}</strong></td>
                  <td><i class="fa-solid fa-water"></i> ${r.hazardName}</td>
                  <td>${r.locationName}</td>
                  <td><span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span></td>
                  <td><span class="badge badge-info">${r.status}</span></td>
                  <td><strong>${r.aiConfidence}%</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Active Emergencies & Weather Mini -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div class="glass-card command-panel">
          <div class="panel-header">
            <h3 class="panel-title"><i class="fa-solid fa-triangle-exclamation text-gradient"></i> District Emergency Advisory</h3>
          </div>
          ${alerts.slice(0, 2).map(a => `
            <div style="padding: 0.85rem; background: rgba(255, 59, 48, 0.08); border-left: 3px solid var(--color-${a.level.toLowerCase()}); border-radius: var(--radius-sm); margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                <span class="badge badge-${a.level.toLowerCase()}">${a.level} ALERT</span>
                <span style="font-size: 0.75rem; color: var(--text-dim);">${formatDate(a.timestamp)}</span>
              </div>
              <h4 style="font-size: 0.95rem; margin-bottom: 0.3rem;">${a.title}</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted);">${a.instructions}</p>
            </div>
          `).join('')}
        </div>

      </div>

    </div>
  `;
}

// --------------------------------------------------------------------------
// 2. Government Officer Command Dashboard
// --------------------------------------------------------------------------
function renderGovernmentDashboard(user, reports, alerts, rescueTeams) {
  const pendingReports = reports.filter(r => r.status === 'Pending Review' || r.status === 'In Progress');

  return `
    <div class="stats-grid">
      <div class="glass-card stat-card critical">
        <div class="stat-info">
          <h3>${reports.length}</h3>
          <p>Total District Incidents</p>
        </div>
        <i class="fa-solid fa-shield-virus stat-icon"></i>
      </div>

      <div class="glass-card stat-card warning">
        <div class="stat-info">
          <h3>${pendingReports.length}</h3>
          <p>Pending Approval</p>
        </div>
        <i class="fa-solid fa-hourglass-half stat-icon"></i>
      </div>

      <div class="glass-card stat-card success">
        <div class="stat-info">
          <h3>${rescueTeams.length}</h3>
          <p>Active Rescue Units</p>
        </div>
        <i class="fa-solid fa-ship stat-icon"></i>
      </div>

      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>94%</h3>
          <p>AI Verification Index</p>
        </div>
        <i class="fa-solid fa-microchip stat-icon"></i>
      </div>
    </div>

    <!-- Government Command Actions -->
    <div class="glass-card command-panel" style="margin-bottom: 1.5rem;">
      <div class="panel-header">
        <h3 class="panel-title"><i class="fa-solid fa-bullhorn text-gradient"></i> Emergency Command Controls</h3>
        <div style="display: flex; gap: 0.75rem;">
          <button onclick="triggerEmergencyBroadcastModal()" class="btn btn-danger btn-sm">
            <i class="fa-solid fa-radio"></i> Broadcast Emergency Alert
          </button>
          <a href="map.html" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-map-location-dot"></i> Command GIS View
          </a>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hazard Name</th>
              <th>Location</th>
              <th>AI Score</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${reports.map(r => `
              <tr>
                <td><strong>${r.id}</strong></td>
                <td><i class="fa-solid fa-hazard-triangle"></i> ${r.hazardName}</td>
                <td>${r.locationName}</td>
                <td><strong style="color: var(--cyan-primary);">${r.verificationScore}%</strong></td>
                <td><span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span></td>
                <td><span class="badge badge-info">${r.status}</span></td>
                <td>
                  ${r.status === 'Pending Review' ? `
                    <button onclick="approveReport('${r.id}')" class="btn btn-primary btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">Approve</button>
                    <button onclick="rejectReport('${r.id}')" class="btn btn-outline btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; border-color: var(--color-critical); color: var(--color-critical);">Reject</button>
                  ` : `
                    <span style="font-size: 0.8rem; color: var(--text-dim);"><i class="fa-solid fa-check-double"></i> Processed</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 3. Rescue Team Dashboard
// --------------------------------------------------------------------------
function renderRescueDashboard(user, reports, rescueTeams) {
  return `
    <div class="stats-grid">
      <div class="glass-card stat-card critical">
        <div class="stat-info">
          <h3>2</h3>
          <p>Dispatched Missions</p>
        </div>
        <i class="fa-solid fa-helicopter stat-icon"></i>
      </div>

      <div class="glass-card stat-card success">
        <div class="stat-info">
          <h3>14</h3>
          <p>Rescued Lives Today</p>
        </div>
        <i class="fa-solid fa-life-ring stat-icon"></i>
      </div>

      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>CG-ALPHA</h3>
          <p>Assigned Call Sign</p>
        </div>
        <i class="fa-solid fa-radio stat-icon"></i>
      </div>
    </div>

    <div class="glass-card command-panel">
      <div class="panel-header">
        <h3 class="panel-title"><i class="fa-solid fa-person-shelter text-gradient"></i> Active Dispatched Missions</h3>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Team Unit</th>
              <th>Assigned Report</th>
              <th>Vessel / Unit Type</th>
              <th>Base Location</th>
              <th>Status</th>
              <th>Progress Update</th>
            </tr>
          </thead>
          <tbody>
            ${rescueTeams.map(t => `
              <tr>
                <td><strong>${t.name}</strong></td>
                <td><a href="map.html" style="text-decoration: underline;">${t.assignedReportId}</a></td>
                <td>${t.type}</td>
                <td>${t.basePort}</td>
                <td><span class="badge badge-high">${t.status}</span></td>
                <td>
                  <select onchange="updateRescueStatus('${t.id}', this.value)" style="background: #030a16; border: 1px solid var(--border-color); color: #fff; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
                    <option value="Pending" ${t.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Accepted" ${t.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
                    <option value="En Route" ${t.status === 'En Route' ? 'selected' : ''}>En Route</option>
                    <option value="Rescuing" ${t.status === 'Rescuing' ? 'selected' : ''}>Rescuing</option>
                    <option value="Completed" ${t.status === 'Completed' ? 'selected' : ''}>Completed</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 4. System Admin Panel
// --------------------------------------------------------------------------
function renderAdminDashboard(user, reports, alerts) {
  const users = Storage.getUsers();

  return `
    <div class="stats-grid">
      <div class="glass-card stat-card">
        <div class="stat-info">
          <h3>${users.length}</h3>
          <p>Total Registered Users</p>
        </div>
        <i class="fa-solid fa-users-gear stat-icon"></i>
      </div>

      <div class="glass-card stat-card success">
        <div class="stat-info">
          <h3>100%</h3>
          <p>System Uptime</p>
        </div>
        <i class="fa-solid fa-server stat-icon"></i>
      </div>

      <div class="glass-card stat-card warning">
        <div class="stat-info">
          <h3>LocalJSON</h3>
          <p>Database Storage Engine</p>
        </div>
        <i class="fa-solid fa-database stat-icon"></i>
      </div>
    </div>

    <div class="glass-card command-panel">
      <div class="panel-header">
        <h3 class="panel-title"><i class="fa-solid fa-sliders text-gradient"></i> Admin Management Controls</h3>
        <div style="display: flex; gap: 0.75rem;">
          <button onclick="exportFullJSONData()" class="btn btn-outline btn-sm"><i class="fa-solid fa-download"></i> Export Data JSON</button>
          <button onclick="Storage.resetData()" class="btn btn-danger btn-sm"><i class="fa-solid fa-rotate-left"></i> Reset Seed Data</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>District</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td><strong>${u.id}</strong></td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="badge badge-info">${u.role}</span></td>
                <td>${u.district || 'India'}</td>
                <td><span class="badge badge-low">Active</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Handler Actions
function approveReport(id) {
  Storage.updateReport(id, { status: 'Verified', verificationScore: 99 });
  showToast(`Report ${id} Approved by Officer`, 'success');
  renderDashboardView();
}

function rejectReport(id) {
  Storage.updateReport(id, { status: 'Rejected' });
  showToast(`Report ${id} Flagged & Rejected`, 'warning');
  renderDashboardView();
}

function updateRescueStatus(teamId, newStatus) {
  const teams = Storage.getRescue();
  const idx = teams.findIndex(t => t.id === teamId);
  if (idx !== -1) {
    teams[idx].status = newStatus;
    Storage.setData(STORAGE_KEYS.RESCUE, teams);
    showToast(`Rescue Team ${teamId} status updated to: ${newStatus}`, 'info');
  }
}

function exportFullJSONData() {
  const data = {
    reports: Storage.getReports(),
    users: Storage.getUsers(),
    alerts: Storage.getAlerts(),
    rescue: Storage.getRescue(),
    weather: Storage.getWeather()
  };
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", jsonStr);
  downloadAnchor.setAttribute("download", `OceanShield_Export_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Full Platform JSON Export Generated!', 'success');
}
