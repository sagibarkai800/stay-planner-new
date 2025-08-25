// Schengen country ISO codes
const SCHENGEN_COUNTRIES = [
  'AUT', // Austria
  'BEL', // Belgium
  'CZE', // Czech Republic
  'DNK', // Denmark
  'EST', // Estonia
  'FIN', // Finland
  'FRA', // France
  'DEU', // Germany
  'GRC', // Greece
  'HUN', // Hungary
  'ISL', // Iceland
  'ITA', // Italy
  'LVA', // Latvia
  'LTU', // Lithuania
  'LUX', // Luxembourg
  'MLT', // Malta
  'NLD', // Netherlands
  'NOR', // Norway
  'POL', // Poland
  'PRT', // Portugal
  'SVK', // Slovakia
  'SVN', // Slovenia
  'ESP', // Spain
  'SWE', // Sweden
  'CHE', // Switzerland
  'HRV'  // Croatia
];

/**
 * Calculate total days spent in a date range, optionally filtered by country
 * @param {Array} trips - Array of trip objects with country, start_date, end_date
 * @param {string} start - Start date (YYYY-MM-DD)
 * @param {string} end - End date (YYYY-MM-DD)
 * @param {string} country - Optional country filter (ISO code)
 * @returns {number} Total days
 */
function daysInRange(trips, start, end, country = null) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (startDate > endDate) {
    return 0;
  }

  let totalDays = 0;
  
  for (const trip of trips) {
    const tripStart = new Date(trip.start_date);
    const tripEnd = new Date(trip.end_date);
    
    // Skip if country filter doesn't match
    if (country && trip.country !== country) {
      continue;
    }
    
    // Calculate overlap with the specified range
    const overlapStart = new Date(Math.max(startDate.getTime(), tripStart.getTime()));
    const overlapEnd = new Date(Math.min(endDate.getTime(), tripEnd.getTime()));
    
    if (overlapStart <= overlapEnd) {
      const daysDiff = Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1;
      totalDays += daysDiff;
    }
  }
  
  return totalDays;
}

/**
 * Calculate Schengen remaining days using rolling 180-day window (but 90-day limit)
 * @param {Array} trips - Array of trip objects with country, start_date, end_date
 * @param {string} referenceDate - Reference date (YYYY-MM-DD) for calculation
 * @returns {Object} {used, remaining, windowStart, windowEnd}
 */
function schengenRemainingDays(trips, referenceDate) {
  const refDate = new Date(referenceDate);
  const windowStart = new Date(refDate.getTime() - (179 * 24 * 60 * 60 * 1000)); // 179 days back (180th day is today)
  const windowEnd = refDate;
  
  let usedDays = 0;
  
  for (const trip of trips) {
    // Only count Schengen countries
    if (!SCHENGEN_COUNTRIES.includes(trip.country)) {
      continue;
    }
    
    const tripStart = new Date(trip.start_date);
    const tripEnd = new Date(trip.end_date);
    
    // Check if trip overlaps with the 180-day window
    if (tripEnd >= windowStart && tripStart <= windowEnd) {
      // Calculate overlap
      const overlapStart = new Date(Math.max(windowStart.getTime(), tripStart.getTime()));
      const overlapEnd = new Date(Math.min(windowEnd.getTime(), tripEnd.getTime()));
      
      if (overlapStart <= overlapEnd) {
        const daysDiff = Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1;
        usedDays += daysDiff;
      }
    }
  }
  
  const remaining = Math.max(0, 90 - usedDays);
  
  return {
    used: usedDays,
    remaining: remaining,
    windowStart: windowStart.toISOString().split('T')[0],
    windowEnd: windowEnd.toISOString().split('T')[0]
  };
}

/**
 * Calculate residency status for a specific year (183+ days threshold)
 * @param {Array} trips - Array of trip objects with country, start_date, end_date
 * @param {number} year - Year to calculate for
 * @returns {Object} Days per country and threshold status
 */
function residency183Status(trips, year) {
  const yearStart = new Date(year, 0, 1); // January 1st
  const yearEnd = new Date(year, 11, 31); // December 31st
  
  const countryDays = {};
  
  for (const trip of trips) {
    const tripStart = new Date(trip.start_date);
    const tripEnd = new Date(trip.end_date);
    
    // Check if trip is in the specified year
    if (tripStart.getFullYear() === year || tripEnd.getFullYear() === year) {
      // Calculate overlap with the year
      const overlapStart = new Date(Math.max(yearStart.getTime(), tripStart.getTime()));
      const overlapEnd = new Date(Math.min(yearEnd.getTime(), tripEnd.getTime()));
      
      if (overlapStart <= overlapEnd) {
        const daysDiff = Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1;
        
        if (!countryDays[trip.country]) {
          countryDays[trip.country] = 0;
        }
        countryDays[trip.country] += daysDiff;
      }
    }
  }
  
  // Calculate threshold status for each country
  const result = {};
  for (const [country, days] of Object.entries(countryDays)) {
    result[country] = {
      days: days,
      meetsThreshold: days >= 183
    };
  }
  
  return result;
}

/**
 * Get all Schengen countries
 * @returns {Array} Array of Schengen country ISO codes
 */
function getSchengenCountries() {
  return [...SCHENGEN_COUNTRIES];
}

/**
 * Check if a country is in Schengen
 * @param {string} countryCode - Country ISO code
 * @returns {boolean} True if country is in Schengen
 */
function isSchengenCountry(countryCode) {
  return SCHENGEN_COUNTRIES.includes(countryCode);
}

module.exports = {
  daysInRange,
  schengenRemainingDays,
  residency183Status,
  getSchengenCountries,
  isSchengenCountry,
  SCHENGEN_COUNTRIES
};
