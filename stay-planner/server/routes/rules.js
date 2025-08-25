const express = require('express');
const { requireAuth } = require('../middleware/auth');
const rules = require('../lib/rules');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/rules/schengen-countries
router.get('/schengen-countries', (req, res) => {
  try {
    const countries = rules.getSchengenCountries();
    res.json({
      success: true,
      count: countries.length,
      countries: countries
    });
  } catch (error) {
    console.error('Error getting Schengen countries:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get Schengen countries' 
    });
  }
});

// POST /api/rules/days-in-range
router.post('/days-in-range', (req, res) => {
  try {
    const { trips, start, end, country } = req.body;
    
    if (!trips || !start || !end) {
      return res.status(400).json({
        success: false,
        error: 'trips, start, and end are required'
      });
    }
    
    const days = rules.daysInRange(trips, start, end, country);
    
    res.json({
      success: true,
      days: days,
      start: start,
      end: end,
      country: country || 'all'
    });
  } catch (error) {
    console.error('Error calculating days in range:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to calculate days in range' 
    });
  }
});

// POST /api/rules/schengen-status
router.post('/schengen-status', (req, res) => {
  try {
    const { trips, referenceDate } = req.body;
    
    if (!trips || !referenceDate) {
      return res.status(400).json({
        success: false,
        error: 'trips and referenceDate are required'
      });
    }
    
    const status = rules.schengenRemainingDays(trips, referenceDate);
    
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error calculating Schengen status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to calculate Schengen status' 
    });
  }
});

// POST /api/rules/residency-status
router.post('/residency-status', (req, res) => {
  try {
    const { trips, year } = req.body;
    
    if (!trips || !year) {
      return res.status(400).json({
        success: false,
        error: 'trips and year are required'
      });
    }
    
    const status = rules.residency183Status(trips, year);
    
    res.json({
      success: true,
      year: year,
      status: status
    });
  } catch (error) {
    console.error('Error calculating residency status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to calculate residency status' 
    });
  }
});

// GET /api/rules/check-country
router.get('/check-country/:countryCode', (req, res) => {
  try {
    const { countryCode } = req.params;
    
    if (!countryCode) {
      return res.status(400).json({
        success: false,
        error: 'countryCode is required'
      });
    }
    
    const isSchengen = rules.isSchengenCountry(countryCode.toUpperCase());
    
    res.json({
      success: true,
      countryCode: countryCode.toUpperCase(),
      isSchengen: isSchengen
    });
  } catch (error) {
    console.error('Error checking country:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check country' 
    });
  }
});

module.exports = router;
