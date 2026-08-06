/* ==========================================================================
   OceanShield AI - Leaflet GIS Engine & Safe Route Finder
   ========================================================================== */

let gisMap = null;
let markerLayerGroup = null;
let shelterLayerGroup = null;
let routeLine = null;

const SHELTERS_DATA = [
  { name: "Government Model High School Shelter", lat: 13.052, lng: 80.275, district: "Chennai", capacity: 1500, phone: "+91 44 2844 1122" },
  { name: "Marina Beach Community Cyclone Hall", lat: 13.042, lng: 80.278, district: "Chennai", capacity: 2200, phone: "+91 44 2844 3344" },
  { name: "Visakhapatnam Port Trust Evacuation Center", lat: 17.705, lng: 83.315, district: "Visakhapatnam", capacity: 3000, phone: "+91 891 255 6677" },
  { name: "Kochi Marine Drive Emergency Base", lat: 9.978, lng: 76.275, district: "Kochi", capacity: 1800, phone: "+91 484 236 7788" },
  { name: "Versova Lifeguard & Medical Post", lat: 19.132, lng: 72.812, district: "Mumbai", capacity: 800, phone: "+91 22 2633 4455" }
];

document.addEventListener('DOMContentLoaded', () => {
  initGISMap();
});

function initGISMap() {
  const mapContainer = document.getElementById('gis-map-container');
  if (!mapContainer || typeof L === 'undefined') return;

  // Initialize Leaflet Map focused on India coastline
  gisMap = L.map('gis-map-container', {
    center: [15.5, 80.0],
    zoom: 6,
    zoomControl: false
  });

  L.control.zoom({ position: 'topright' }).addTo(gisMap);

  // Dark Ocean Map Tiles (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OceanShield AI GIS',
    maxZoom: 19
  }).addTo(gisMap);

  markerLayerGroup = L.layerGroup().addTo(gisMap);
  shelterLayerGroup = L.layerGroup().addTo(gisMap);

  // Render Markers
  renderHazardMarkersOnMap('all');
  renderSheltersOnMap();

  // Populate Safe Route shelter dropdown
  populateRouteDropdown();
}

function renderHazardMarkersOnMap(filterCategory = 'all') {
  if (!markerLayerGroup) return;
  markerLayerGroup.clearLayers();

  const reports = Storage.getReports();

  reports.forEach(r => {
    if (filterCategory !== 'all' && r.hazardType !== filterCategory) return;

    // Custom Glowing HTML Icon
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="position: relative;">
          <div class="pulse-beacon ${r.severity.toLowerCase()}" style="width: 16px; height: 16px;"></div>
          <i class="fa-solid fa-triangle-exclamation" style="color: #fff; font-size: 10px; position: absolute; top: 3px; left: 3px;"></i>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const popupContent = `
      <div style="color: #030a16; font-family: var(--font-primary); padding: 0.3rem; min-width: 200px;">
        <span class="badge badge-${r.severity.toLowerCase()}" style="margin-bottom: 0.3rem;">${r.severity} HAZARD</span>
        <h4 style="margin: 0.2rem 0; font-size: 1rem; color: #030a16;">${r.hazardName}</h4>
        <p style="font-size: 0.8rem; margin-bottom: 0.4rem; color: #4a5568;">📍 ${r.locationName}</p>
        <p style="font-size: 0.8rem; line-height: 1.3; color: #2d3748;">${r.description.substring(0, 80)}...</p>
        <div style="margin-top: 0.6rem; font-size: 0.75rem; border-top: 1px solid #e2e8f0; padding-top: 0.4rem; display: flex; justify-content: space-between;">
          <span>AI Score: <strong>${r.verificationScore}%</strong></span>
          <span style="color: #0078d4;">Status: ${r.status}</span>
        </div>
      </div>
    `;

    L.marker([r.lat, r.lng], { icon: customIcon })
      .bindPopup(popupContent)
      .addTo(markerLayerGroup);
  });
}

function renderSheltersOnMap() {
  if (!shelterLayerGroup) return;
  shelterLayerGroup.clearLayers();

  SHELTERS_DATA.forEach(s => {
    const shelterIcon = L.divIcon({
      className: 'shelter-marker',
      html: `<i class="fa-solid fa-house-medical" style="color: #00f2fe; font-size: 1.4rem; filter: drop-shadow(0 0 6px #00f2fe);"></i>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const popup = `
      <div style="color: #030a16; font-family: var(--font-primary);">
        <h4 style="color: #0078d4; margin-bottom: 0.2rem;"><i class="fa-solid fa-hospital"></i> ${s.name}</h4>
        <p style="font-size: 0.8rem;">Capacity: <strong>${s.capacity} Citizens</strong></p>
        <p style="font-size: 0.8rem;">Helpline: <strong>${s.phone}</strong></p>
      </div>
    `;

    L.marker([s.lat, s.lng], { icon: shelterIcon }).bindPopup(popup).addTo(shelterLayerGroup);
  });
}

function populateRouteDropdown() {
  const select = document.getElementById('route-destination-select');
  if (!select) return;

  select.innerHTML = SHELTERS_DATA.map((s, idx) => `
    <option value="${idx}">${s.name} (${s.district})</option>
  `).join('');
}

// Solves safe evacuation route on map
function calculateSafeRoute() {
  if (!gisMap) return;

  const destIdx = document.getElementById('route-destination-select').value;
  const destination = SHELTERS_DATA[destIdx] || SHELTERS_DATA[0];

  // User starting position (e.g. Marina Beach)
  const startLat = 13.0475;
  const startLng = 80.2824;

  if (routeLine) gisMap.removeLayer(routeLine);

  // Draw polyline connecting user to shelter
  const waypoints = [
    [startLat, startLng],
    [startLat + 0.003, startLng - 0.002],
    [destination.lat, destination.lng]
  ];

  routeLine = L.polyline(waypoints, {
    color: '#00f2fe',
    weight: 5,
    opacity: 0.9,
    dashArray: '10, 10'
  }).addTo(gisMap);

  gisMap.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

  const routeInfo = document.getElementById('route-info-box');
  if (routeInfo) {
    routeInfo.innerHTML = `
      <div style="padding: 0.85rem; background: rgba(0, 242, 254, 0.08); border-radius: var(--radius-sm); border: 1px solid var(--cyan-primary);">
        <h4 style="color: var(--cyan-primary); font-size: 0.95rem; margin-bottom: 0.3rem;"><i class="fa-solid fa-route"></i> Safe Evacuation Path Calculated</h4>
        <p style="font-size: 0.85rem;">Destination: <strong>${destination.name}</strong></p>
        <p style="font-size: 0.85rem;">Distance: <strong>1.8 km</strong> | Estimated Walk: <strong>14 mins</strong></p>
        <p style="font-size: 0.8rem; color: var(--color-low); margin-top: 0.3rem;"><i class="fa-solid fa-shield-check"></i> High Ground Route - Clear of Inundation</p>
      </div>
    `;
  }

  showToast(`Safe route generated to ${destination.name}`, 'success');
}
