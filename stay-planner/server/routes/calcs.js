const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listTripsByUser } = require('../db');
const rules = require('../lib/rules');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/calcs/schengen?date=YYYY-MM-DD
router.get('/schengen', async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;

    // Validate date parameter
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required (YYYY-MM-DD)'
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Date must be in YYYY-MM-DD format'
      });
    }

    // Validate date is valid
    const referenceDate = new Date(date);
    if (isNaN(referenceDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    // Get user's trips
    const trips = await listTripsByUser(userId);
    
    // Calculate Schengen status
    const schengenStatus = rules.schengenRemainingDays(trips, date);
    
    // Format response with friendly fields
    res.json({
      success: true,
      calculation_date: date,
      schengen_status: {
        days_used: schengenStatus.used,
        days_remaining: schengenStatus.remaining,
        window_start: schengenStatus.windowStart,
        window_end: schengenStatus.windowEnd,
        total_window_days: 180,
        percentage_used: Math.round((schengenStatus.used / 180) * 100),
        status: schengenStatus.remaining > 0 ? 'available' : 'limit_reached'
      },
      user_trips_count: trips.length,
      message: schengenStatus.remaining > 0 
        ? `You have ${schengenStatus.remaining} days remaining in the Schengen area`
        : 'You have reached the 180-day limit in the Schengen area'
    });

  } catch (error) {
    console.error('Error calculating Schengen status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate Schengen status'
    });
  }
});

// GET /api/calcs/residency?year=YYYY
router.get('/residency', async (req, res) => {
  try {
    const { year } = req.query;
    const userId = req.user.id;

    // Validate year parameter
    if (!year) {
      return res.status(400).json({
        success: false,
        error: 'Year parameter is required (YYYY)'
      });
    }

    // Validate year format
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(year)) {
      return res.status(400).json({
        success: false,
        error: 'Year must be in YYYY format'
      });
    }

    // Validate year is reasonable
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    if (yearNum < 2000 || yearNum > currentYear + 10) {
      return res.status(400).json({
        success: false,
        error: `Year must be between 2000 and ${currentYear + 10}`
      });
    }

    // Get user's trips
    const trips = await listTripsByUser(userId);
    
    // Calculate residency status
    const residencyStatus = rules.residency183Status(trips, yearNum);
    
    // Format response with friendly fields
    const formattedStatus = {};
    let totalCountries = 0;
    let countriesMeetingThreshold = 0;
    
    Object.entries(residencyStatus).forEach(([country, status]) => {
      formattedStatus[country] = {
        days_spent: status.days,
        meets_residency_threshold: status.meetsThreshold,
        threshold_days: 183,
        days_remaining: Math.max(0, 183 - status.days),
        status: status.meetsThreshold ? 'resident' : 'visitor'
      };
      
      totalCountries++;
      if (status.meetsThreshold) {
        countriesMeetingThreshold++;
      }
    });

    res.json({
      success: true,
      calculation_year: year,
      residency_summary: {
        total_countries_visited: totalCountries,
        countries_meeting_threshold: countriesMeetingThreshold,
        countries_below_threshold: totalCountries - countriesMeetingThreshold,
        residency_threshold_days: 183
      },
      country_details: formattedStatus,
      user_trips_count: trips.length,
      message: countriesMeetingThreshold > 0
        ? `You meet residency requirements in ${countriesMeetingThreshold} country(ies) for ${year}`
        : `You do not meet residency requirements in any country for ${year}`
    });

  } catch (error) {
    console.error('Error calculating residency status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate residency status'
    });
  }
});

// GET /api/calcs/summary - Get comprehensive summary
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();

    // Get user's trips
    const trips = await listTripsByUser(userId);
    
    // Calculate various metrics
    const schengenStatus = rules.schengenRemainingDays(trips, today);
    const residencyStatus = rules.residency183Status(trips, currentYear);
    
    // Count trips by country
    const countryCounts = {};
    trips.forEach(trip => {
      countryCounts[trip.country] = (countryCounts[trip.country] || 0) + 1;
    });

    // Calculate total days traveled
    let totalDays = 0;
    trips.forEach(trip => {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      totalDays += days;
    });

    res.json({
      success: true,
      calculation_date: today,
      summary: {
        total_trips: trips.length,
        total_days_traveled: totalDays,
        countries_visited: Object.keys(countryCounts).length,
        most_visited_country: Object.entries(countryCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || null
      },
      schengen_status: {
        days_used: schengenStatus.used,
        days_remaining: schengenStatus.remaining,
        status: schengenStatus.remaining > 0 ? 'available' : 'limit_reached'
      },
      residency_status: {
        year: currentYear,
        countries_meeting_threshold: Object.values(residencyStatus)
          .filter(status => status.meetsThreshold).length,
        total_countries: Object.keys(residencyStatus).length
      },
      country_breakdown: countryCounts
    });

  } catch (error) {
    console.error('Error calculating summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate summary'
    });
  }
});

module.exports = router;
