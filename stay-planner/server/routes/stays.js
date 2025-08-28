const express = require('express');
const { buildBookingUrl } = require('../services/bookingLinks');
const { buildAirbnbUrl } = require('../services/airbnbLinks');
const telemetry = require('../services/telemetry');
const { 
  parseDate, 
  validateRequiredFields, 
  validateNumericRange, 
  createErrorResponse, 
  createSuccessResponse 
} = require('../utils/shared');

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
    console.log('🔍 Request origin:', req.headers.origin);
    console.log('🔍 Request user-agent:', req.headers['user-agent']);
    
    const { destination, checkin, checkout, adults, lat, lng } = req.body;
    
    // Validate required parameters
    const requiredFields = ['checkin', 'checkout', 'adults'];
    if (!destination && !(lat && lng)) {
      requiredFields.push('destination');
    }
    
    const validation = validateRequiredFields(req.body, requiredFields);
    if (!validation.isValid) {
      return res.status(400).json(createErrorResponse(
        'Missing required fields',
        400,
        { missingFields: validation.errors }
      ));
    }
    
    // Validate adults
    const adultsValidation = validateNumericRange(adults, 1, 20, 'Adults');
    if (!adultsValidation.isValid) {
      return res.status(400).json(createErrorResponse(adultsValidation.error));
    }
    
    // Validate dates
    try {
      const checkinDate = parseDate(checkin);
      const checkoutDate = parseDate(checkout);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkinDate < today) {
        return res.status(400).json(createErrorResponse('Check-in date cannot be in the past'));
      }
      
      if (checkoutDate <= checkinDate) {
        return res.status(400).json(createErrorResponse('Check-out date must be after check-in date'));
      }
    } catch (error) {
      return res.status(400).json(createErrorResponse(error.message));
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
      return res.status(500).json(createErrorResponse(
        'Failed to generate Booking.com link',
        500,
        { originalError: error.message }
      ));
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
    console.log('🔍 Response JSON string:', JSON.stringify(response));
    
    // Log telemetry event
    const mockMode = !process.env.BOOKING_AFFILIATE_ID;
    const userId = req.user?.id || null;
    telemetry.logStaysLinks({
      destination: destinationParam,
      checkin,
      checkout,
      adults,
      hasCoordinates: !!(lat && lng),
      airbnbEnabled: !!airbnbUrl
    }, userId, mockMode);
    
    // Ensure we're sending valid JSON
    try {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
      console.log('🔍 Response sent successfully');
    } catch (jsonError) {
      console.error('🔍 Error sending JSON response:', jsonError);
      res.status(500).json({ error: 'Failed to send response' });
    }
    
  } catch (error) {
    console.error('Error in /api/stays/links:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json(createErrorResponse(
      'Internal server error',
      500,
      { 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    ));
  }
});

// Add a test endpoint to verify the route is working
router.get('/test', (req, res) => {
  console.log('🔍 Stays test endpoint called');
  
  // Log telemetry event
  telemetry.logUIEvent('stays_test_endpoint', {}, null);
  
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

