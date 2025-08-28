// Provider configuration for flights and accommodations
const config = {
  // Flight search provider
  flights: {
    provider: process.env.PROVIDER_FLIGHTS || 'skyscanner',
    skyscanner: {
      apiKey: process.env.SKYSCANNER_API_KEY,
      enabled: !!process.env.SKYSCANNER_API_KEY
    }
  },
  
  // Accommodation booking
  accommodation: {
    booking: {
      affiliateId: process.env.BOOKING_AFFILIATE_ID,
      aidParam: process.env.BOOKING_AID_PARAM || 'aid',
      enabled: !!process.env.BOOKING_AFFILIATE_ID
    },
    airbnb: {
      deepLinksEnabled: process.env.AIRBNB_ENABLE_DEEPLINKS === 'true'
    }
  }
};

// Helper functions
const isFlightProviderEnabled = () => {
  return config.flights.skyscanner.enabled;
};

const isBookingEnabled = () => {
  return config.accommodation.booking.enabled;
};

const isAirbnbEnabled = () => {
  return config.accommodation.airbnb.deepLinksEnabled;
};

const getFlightProviderConfig = () => {
  return config.flights;
};

const getAccommodationConfig = () => {
  return config.accommodation;
};

module.exports = {
  config,
  isFlightProviderEnabled,
  isBookingEnabled,
  isAirbnbEnabled,
  getFlightProviderConfig,
  getAccommodationConfig
};
