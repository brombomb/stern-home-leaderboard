const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to offline data folder
const offlineDataPath = path.join(__dirname, 'offline');

// Helper function to read JSON file
function readOfflineFile(filename) {
  try {
    const filePath = path.join(offlineDataPath, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading offline file ${filename}:`, error);
    return null;
  }
}

// Machines endpoint - serves offline machines data
router.get('/machines', (req, res) => {
  console.log('Offline: Serving machines data');
  const data = readOfflineFile('machines.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to read offline machines data' });
  }
});

// High scores endpoint - serves offline high scores data
router.get('/high-scores/:machineId', (req, res) => {
  const machineId = req.params.machineId;
  console.log(`Offline: Serving high scores for machine ${machineId}`);

  const filename = `highscores-${machineId}.json`;
  const data = readOfflineFile(filename);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: `No offline high scores found for machine ${machineId}` });
  }
});

// Machine details endpoint - serves offline machine details
router.get('/machine-details/:machineId', (req, res) => {
  const machineId = req.params.machineId;
  console.log(`Offline: Serving machine details for machine ${machineId}`);

  // For now, use the location ID as the filename (since that's what we have)
  // In a real scenario, you might need to map machine IDs to the correct files
  const filename = `machine-details-${machineId}.json`;
  let data = readOfflineFile(filename);

  // If specific machine file doesn't exist, try the location-based file
  if (!data) {
    const locationFilename = 'machine-details-13678.json';
    data = readOfflineFile(locationFilename);
  }

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: `No offline machine details found for machine ${machineId}` });
  }
});

// Game teams endpoint - serves offline game teams data
router.get('/game-teams/:locationId', (req, res) => {
  const locationId = req.params.locationId;
  console.log(`Offline: Serving game teams for location ${locationId}`);

  const filename = `game-teams-${locationId}.json`;
  let data = readOfflineFile(filename);

  // If location-specific file doesn't exist, try the portal-prefixed file
  if (!data) {
    const portalFilename = `portal-game-teams-${locationId}.json`;
    data = readOfflineFile(portalFilename);
  }

  // If portal file doesn't exist, try the machine-based file
  if (!data) {
    const machineFilename = 'game-teams-35884.json';
    data = readOfflineFile(machineFilename);
  }

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: `No offline game teams found for location ${locationId}` });
  }
});

// List available offline files (for debugging)
router.get('/offline-files', (req, res) => {
  const files = fs.readdirSync(offlineDataPath);
  res.json({ files });
});

module.exports = router;
