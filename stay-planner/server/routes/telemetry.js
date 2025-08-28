const express = require('express');
const router = express.Router();
const telemetry = require('../services/telemetry');
const { requireAuth } = require('../middleware/auth');

// POST /api/telemetry - Log UI events
router.post('/', requireAuth, (req, res) => {
  try {
    const { eventType, params = {} } = req.body;
    const userId = req.user.id;

    if (!eventType) {
      return res.status(400).json({ 
        success: false, 
        error: 'eventType is required' 
      });
    }

    // Log the UI event
    telemetry.logUIEvent(eventType, params, userId);

    res.json({ 
      success: true, 
      message: 'Event logged successfully' 
    });
  } catch (error) {
    console.error('Telemetry logging error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to log event' 
    });
  }
});

// GET /api/telemetry/health - Health check for telemetry service
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
