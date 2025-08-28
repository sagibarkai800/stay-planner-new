/**
 * Feature Flags Configuration
 * Controls which features are enabled/disabled based on environment and provider settings
 */

const { 
  isFlightProviderEnabled, 
  isBookingEnabled, 
  isAirbnbEnabled 
} = require('./providers');

// Feature flags
const FLAGS = {
  // Flight search functionality
  FLIGHTS_ENABLED: isFlightProviderEnabled(),
  
  // Accommodation search functionality (always enabled as we have fallback)
  STAYS_ENABLED: true,
  
  // Airbnb deep links
  AIRBNB_DEEPLINKS_ENABLED: isAirbnbEnabled(),
  
  // Booking.com affiliate integration
  BOOKING_AFFILIATE_ENABLED: isBookingEnabled(),
  
  // Telemetry system
  TELEMETRY_ENABLED: true,
  
  // Email alerts (depends on SMTP configuration)
  EMAIL_ALERTS_ENABLED: !!(
    process.env.SMTP_HOST && 
    process.env.SMTP_PORT && 
    process.env.SMTP_USER && 
    process.env.SMTP_PASS
  ),
  
  // File uploads
  FILE_UPLOADS_ENABLED: true,
  
  // Cron jobs
  CRON_JOBS_ENABLED: true
};

// Helper function to get all flags
const getAllFlags = () => ({ ...FLAGS });

// Helper function to check if a feature is enabled
const isFeatureEnabled = (featureName) => {
  if (!FLAGS.hasOwnProperty(featureName)) {
    console.warn(`Unknown feature flag: ${featureName}`);
    return false;
  }
  return FLAGS[featureName];
};

// Helper function to get feature status for API responses
const getFeatureStatus = () => {
  return {
    flights: {
      enabled: FLAGS.FLIGHTS_ENABLED,
      mode: FLAGS.FLIGHTS_ENABLED ? 'live' : 'mock',
      provider: process.env.PROVIDER_FLIGHTS || 'none'
    },
    stays: {
      enabled: FLAGS.STAYS_ENABLED,
      booking: {
        enabled: FLAGS.BOOKING_AFFILIATE_ENABLED,
        affiliateId: FLAGS.BOOKING_AFFILIATE_ENABLED ? 'configured' : 'not configured'
      },
      airbnb: {
        deepLinksEnabled: FLAGS.AIRBNB_DEEPLINKS_ENABLED
      }
    },
    telemetry: {
      enabled: FLAGS.TELEMETRY_ENABLED
    },
    emailAlerts: {
      enabled: FLAGS.EMAIL_ALERTS_ENABLED,
      smtpConfigured: !!(
        process.env.SMTP_HOST && 
        process.env.SMTP_PORT && 
        process.env.SMTP_USER && 
        process.env.SMTP_PASS
      )
    },
    fileUploads: {
      enabled: FLAGS.FILE_UPLOADS_ENABLED
    },
    cronJobs: {
      enabled: FLAGS.CRON_JOBS_ENABLED
    }
  };
};

// Helper function to get disabled features
const getDisabledFeatures = () => {
  return Object.entries(FLAGS)
    .filter(([_, enabled]) => !enabled)
    .map(([feature]) => feature);
};

// Helper function to check if any critical features are disabled
const hasCriticalFeaturesDisabled = () => {
  const criticalFeatures = ['STAYS_ENABLED', 'TELEMETRY_ENABLED'];
  return criticalFeatures.some(feature => !FLAGS[feature]);
};

module.exports = {
  FLAGS,
  getAllFlags,
  isFeatureEnabled,
  getFeatureStatus,
  getDisabledFeatures,
  hasCriticalFeaturesDisabled
};
