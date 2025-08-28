const express = require('express');
const { buildBookingUrl } = require('../services/bookingLinks');
const { buildAirbnbUrl } = require('../services/airbnbLinks');

const router = express.Router();

/**
 * Generate accommodation booking links
 * POST /api/stays/links
 * Body: { destination, checkin, checkout, adults, lat?, lng? }
 * Returns: { bookingUrl, airbnbUrl? }
 */
router.post('/links', (req, res) => {
  try {
    console.log('🔍 Stays API called with body:', req.body);
    console.log('🔍 Request headers:', req.headers);
    console.log('🔍 Request method:', req.method);
    console.log('🔍 Request URL:', req.url);
    
    const { destination, checkin, checkout, adults, lat, lng } = req.body;
    
    // Validate required parameters
    if (!destination && !(lat && lng)) {
      return res.status(400).json({
        error: 'Destination (city name) or coordinates (lat, lng) are required'
      });
    }
    
    if (!checkin || !checkout) {
      return res.status(400).json({
        error: 'Check-in and check-out dates are required'
      });
    }
    
    if (!adults || adults < 1 || adults > 20) {
      return res.status(400).json({
        error: 'Valid number of adults (1-20) is required'
      });
    }
    
    // Validate dates
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    
    if (checkinDate < today) {
      return res.status(400).json({
        error: 'Check-in date cannot be in the past'
      });
    }
    
    if (checkoutDate <= checkinDate) {
      return res.status(400).json({
        error: 'Check-out date must be after check-in date'
      });
    }
    
    // Build destination parameter
    let destinationParam;
    if (lat && lng) {
      // Use coordinates if provided
      destinationParam = { lat: parseFloat(lat), lng: parseFloat(lng) };
    } else {
      // Use city name
      destinationParam = destination;
    }
    
    // Generate Booking.com URL
    let bookingUrl;
    try {
      console.log('🔍 Building Booking.com URL with:', { destination: destinationParam, checkin, checkout, adults });
      console.log('🔍 Environment check - BOOKING_AFFILIATE_ID:', process.env.BOOKING_AFFILIATE_ID);
      
      if (!process.env.BOOKING_AFFILIATE_ID) {
        // For development/testing, provide a mock URL
        console.log('🔍 No affiliate ID set, using mock URL');
        bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destinationParam)}&checkin=${checkin}&checkout=${checkout}&group_adults=${adults}&no_rooms=1&aid=DEMO`;
      } else {
      
              bookingUrl = buildBookingUrl({
          destination: destinationParam,
          checkin,
          checkout,
          adults
        });
        console.log('🔍 Generated Booking.com URL:', bookingUrl);
      }
    } catch (error) {
      console.error('Error building Booking.com URL:', error);
      return res.status(500).json({
        error: 'Failed to generate Booking.com link: ' + error.message
      });
    }
    
    // Generate Airbnb URL (optional)
    let airbnbUrl = null;
    try {
      console.log('🔍 Building Airbnb URL with:', { destination: destinationParam, checkin, checkout, adults });
      airbnbUrl = buildAirbnbUrl({
        destination: destinationParam,
        checkin,
        checkout,
        adults
      });
      console.log('🔍 Generated Airbnb URL:', airbnbUrl);
    } catch (error) {
      console.error('Error building Airbnb URL:', error);
      // Don't fail the request if Airbnb fails, just log it
    }
    
    // Return URLs
    const response = {
      bookingUrl,
      ...(airbnbUrl && { airbnbUrl })
    };
    
    console.log('🔍 Final response:', response);
    res.json(response);
    
  } catch (error) {
    console.error('Error in /api/stays/links:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Add a test endpoint to verify the route is working
router.get('/test', (req, res) => {
  console.log('🔍 Stays test endpoint called');
  res.json({ 
    message: 'Stays API is working!',
    timestamp: new Date().toISOString(),
    env: {
      bookingAffiliateId: process.env.BOOKING_AFFILIATE_ID ? 'set' : 'not set',
      airbnbEnabled: process.env.AIRBNB_ENABLE_DEEPLINKS
    }
  });
});

module.exports = router;

