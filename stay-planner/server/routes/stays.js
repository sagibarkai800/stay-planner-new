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
      bookingUrl = buildBookingUrl({
        destination: destinationParam,
        checkin,
        checkout,
        adults
      });
      console.log('🔍 Generated Booking.com URL:', bookingUrl);
    } catch (error) {
      console.error('Error building Booking.com URL:', error);
      return res.status(500).json({
        error: 'Failed to generate Booking.com link: ' + error.message
      });
    }
    
    // Generate Airbnb URL (optional)
    let airbnbUrl = null;
    try {
      airbnbUrl = buildAirbnbUrl({
        destination: destinationParam,
        checkin,
        checkout,
        adults
      });
    } catch (error) {
      console.error('Error building Airbnb URL:', error);
      // Don't fail the request if Airbnb fails, just log it
    }
    
    // Return URLs
    const response = {
      bookingUrl,
      ...(airbnbUrl && { airbnbUrl })
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error in /api/stays/links:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;
