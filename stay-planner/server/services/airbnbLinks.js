/**
 * Airbnb deep link builder
 * Generates search URLs with booking parameters
 * 
 * Note: Airbnb does not provide a public API for accommodation data.
 * This service only generates deep links to Airbnb's search page.
 * For actual accommodation data, you would need to be an Airbnb partner
 * with access to their official API (which requires partnership approval).
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
 * Build Airbnb search URL with booking parameters
 * @param {Object} params - Airbnb search parameters
 * @param {string|Object} params.destination - City name string or { lat, lng } coordinates
 * @param {Date|string} params.checkin - Check-in date
 * @param {Date|string} params.checkout - Check-out date
 * @param {number} params.adults - Number of adults
 * @returns {string|null} Complete Airbnb search URL or null if deep links disabled
 */
const buildAirbnbUrl = ({ destination, checkin, checkout, adults }) => {
  // Check if Airbnb deep links are enabled
  if (process.env.AIRBNB_ENABLE_DEEPLINKS !== 'true') {
    return null;
  }
  
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
  
  // Build Airbnb search URL
  // Note: Airbnb's URL structure may change over time
  const baseUrl = 'https://www.airbnb.com/s';
  
  // Build query parameters
  const params = new URLSearchParams({
    'location': destinationParam,
    'checkin': checkinStr,
    'checkout': checkoutStr,
    'adults': adults.toString(),
    'source': 'search_blocks'
  });
  
  return `${baseUrl}/${destinationParam}/homes?${params.toString()}`;
};

/**
 * Check if Airbnb deep links are enabled
 * @returns {boolean} True if deep links are enabled
 */
const isAirbnbEnabled = () => {
  return process.env.AIRBNB_ENABLE_DEEPLINKS === 'true';
};

module.exports = {
  buildAirbnbUrl,
  isAirbnbEnabled,
  formatDate
};
