/**
 * Booking.com affiliate link builder
 * Generates URLs with affiliate tracking parameters
 */

/**
 * Format date to YYYY-MM-DD format
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('Invalid date provided');
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Build Booking.com URL with affiliate parameters
 * @param {Object} params - Booking parameters
 * @param {string|Object} params.destination - City name string or { lat, lng } coordinates
 * @param {Date|string} params.checkin - Check-in date
 * @param {Date|string} params.checkout - Check-out date
 * @param {number} params.adults - Number of adults
 * @param {string} [params.affiliateId] - Affiliate ID (defaults to BOOKING_AFFILIATE_ID env var)
 * @param {string} [params.aidParam] - Affiliate parameter name (defaults to BOOKING_AID_PARAM env var or 'aid')
 * @returns {string} Complete Booking.com URL with affiliate tracking
 */
const buildBookingUrl = ({ 
  destination, 
  checkin, 
  checkout, 
  adults, 
  affiliateId = process.env.BOOKING_AFFILIATE_ID, 
  aidParam = process.env.BOOKING_AID_PARAM || 'aid' 
}) => {
  // Validate required parameters
  if (!destination) {
    throw new Error('Destination is required');
  }
  
  if (!checkin || !checkout) {
    throw new Error('Check-in and check-out dates are required');
  }
  
  if (!adults || adults < 1) {
    throw new Error('Valid number of adults is required');
  }
  
  if (!affiliateId) {
    throw new Error('Affiliate ID is required');
  }
  
  // Format dates
  const checkinStr = formatDate(checkin);
  const checkoutStr = formatDate(checkout);
  
  // Build destination parameter
  let destinationParam;
  if (typeof destination === 'string') {
    // City name - encode for URL
    destinationParam = encodeURIComponent(destination);
  } else if (destination.lat && destination.lng) {
    // Coordinates
    destinationParam = `${destination.lat},${destination.lng}`;
  } else {
    throw new Error('Destination must be a string (city name) or object with lat/lng coordinates');
  }
  
  // Build base URL
  const baseUrl = 'https://www.booking.com/searchresults.html';
  
  // Build query parameters
  const params = new URLSearchParams({
    [aidParam]: affiliateId,
    'ss': destinationParam,
    'checkin': checkinStr,
    'checkout': checkoutStr,
    'group_adults': adults.toString(),
    'no_rooms': '1'
  });
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Build Airbnb deep link (if enabled)
 * @param {Object} params - Airbnb parameters
 * @param {string|Object} params.destination - City name string or { lat, lng } coordinates
 * @param {Date|string} params.checkin - Check-in date
 * @param {Date|string} params.checkout - Check-out date
 * @param {number} params.adults - Number of adults
 * @returns {string|null} Airbnb URL or null if deep links disabled
 */
const buildAirbnbUrl = ({ destination, checkin, checkout, adults }) => {
  if (process.env.AIRBNB_ENABLE_DEEPLINKS !== 'true') {
    return null;
  }
  
  // Format dates
  const checkinStr = formatDate(checkin);
  const checkoutStr = formatDate(checkout);
  
  // Build destination parameter
  let destinationParam;
  if (typeof destination === 'string') {
    destinationParam = encodeURIComponent(destination);
  } else if (destination.lat && destination.lng) {
    destinationParam = `${destination.lat},${destination.lng}`;
  } else {
    throw new Error('Destination must be a string (city name) or object with lat/lng coordinates');
  }
  
  // Build Airbnb URL
  const baseUrl = 'https://www.airbnb.com/s';
  const params = new URLSearchParams({
    'location': destinationParam,
    'checkin': checkinStr,
    'checkout': checkoutStr,
    'adults': adults.toString()
  });
  
  return `${baseUrl}/${destinationParam}/homes?${params.toString()}`;
};

module.exports = {
  buildBookingUrl,
  buildAirbnbUrl,
  formatDate
};
