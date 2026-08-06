/* ==========================================================================
   OceanShield AI - Intelligence & Risk Engine Simulation
   ========================================================================== */

class AIEngine {
  // Simulates Computer Vision AI Scan on uploaded Image/Video
  analyzeHazardMedia(fileName, hazardTypeHint) {
    const hazardCatalog = Storage.getHazards();
    const hazard = hazardCatalog.find(h => h.id === hazardTypeHint) || hazardCatalog[0];

    const conf = Math.floor(88 + Math.random() * 11); // 88% - 99%
    const severity = hazard.defaultSeverity;

    const recommendations = [
      `Deploy ${hazard.name} containment barriers along nearest shore grid.`,
      `Broadcast Emergency Voice & SMS Alerts to registered coastal residents.`,
      `Mobilize nearest Coast Guard Patrol Boat within 15 km radius.`,
      `Advise port authority to hold non-essential vessel departures.`
    ];

    return {
      detectedHazard: hazard.name,
      hazardId: hazard.id,
      category: hazard.category,
      confidence: conf,
      severity: severity,
      damageEstimate: severity === 'Critical' ? 'Extensive Infrastructure Damage' : 'Moderate Coastal Inundation',
      recommendations: recommendations,
      spamScore: Math.floor(Math.random() * 5), // < 5% spam
      isDuplicate: false
    };
  }

  // Calculates coastal risk score (0 - 100) based on wave height, wind, population density
  calculateRiskScore(districtData) {
    const wave = parseFloat(districtData.waveHeightM || 3.5);
    const wind = parseFloat(districtData.windKmh || 50);
    const pressure = parseFloat(districtData.pressureMb || 1000);

    let score = Math.round((wave * 12) + (wind * 0.4) + ((1013 - pressure) * 1.5));
    if (score > 100) score = 98;
    if (score < 10) score = 15;

    let alertLevel = 'Green';
    if (score > 40) alertLevel = 'Yellow';
    if (score > 65) alertLevel = 'Orange';
    if (score > 85) alertLevel = 'Red';

    return {
      score,
      alertLevel,
      waveRisk: wave > 4.0 ? 'High Swell Danger' : 'Moderate Waves',
      floodRisk: wave > 4.5 ? 'Severe Coastal Inundation' : 'Localized Splashover',
      cycloneRisk: wind > 65 ? 'High Cyclonic Gusts' : 'Breezy Sea Gale'
    };
  }

  // Duplicate hazard report detection
  checkDuplicateReport(lat, lng, hazardType) {
    const reports = Storage.getReports();
    const threshold = 0.05; // approx 5km

    const duplicate = reports.find(r => 
      r.hazardType === hazardType &&
      Math.abs(r.lat - lat) < threshold &&
      Math.abs(r.lng - lng) < threshold
    );

    return duplicate ? { isDuplicate: true, existingId: duplicate.id } : { isDuplicate: false };
  }
}

const AI = new AIEngine();
