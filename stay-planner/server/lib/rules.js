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
 * Calculate Schengen remaining days using rolling 180-day window (90-day limit)
 * @param {Array} trips - Array of trip objects with country, start_date, end_date
 * @param {string} referenceDate - Reference date (YYYY-MM-DD) for calculation
 * @returns {Object} {used, remaining, windowStart, windowEnd}
 */
function schengenRemainingDays(trips, referenceDate) {
  const refDate = new Date(referenceDate);
  
  // If no trips, return full 90 days
  if (!trips || trips.length === 0) {
    return {
      used: 0,
      remaining: 90,
      windowStart: refDate.toISOString().split('T')[0],
      windowEnd: refDate.toISOString().split('T')[0]
    };
  }
  
  // Find the 180-day window that gives the maximum used days
  let maxUsedDays = 0;
  let bestWindowStart = null;
  let bestWindowEnd = null;
  
  // Check multiple 180-day windows ending on or before the reference date
  // We need to check windows that could potentially contain the most used days
  for (let daysBack = 0; daysBack <= 180; daysBack++) {
    const windowEnd = new Date(refDate.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    const windowStart = new Date(windowEnd.getTime() - (179 * 24 * 60 * 60 * 1000)); // 179 days back from window end
    
    let usedDaysInWindow = 0;
    
    for (const trip of trips) {
      // Only count Schengen countries
      if (!SCHENGEN_COUNTRIES.includes(trip.country)) {
        continue;
      }
      
      const tripStart = new Date(trip.start_date);
      const tripEnd = new Date(trip.end_date);
      
      // Check if trip overlaps with this 180-day window
      if (tripEnd >= windowStart && tripStart <= windowEnd) {
        // Calculate overlap
        const overlapStart = new Date(Math.max(windowStart.getTime(), tripStart.getTime()));
        const overlapEnd = new Date(Math.min(windowEnd.getTime(), tripEnd.getTime()));
        
        if (overlapStart <= overlapEnd) {
          const daysDiff = Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1;
          usedDaysInWindow += daysDiff;
        }
      }
    }
    
    // Update if this window has more used days
    if (usedDaysInWindow > maxUsedDays) {
      maxUsedDays = usedDaysInWindow;
      bestWindowStart = windowStart;
      bestWindowEnd = windowEnd;
    }
  }
  
  // Ensure we have valid window dates (fallback to reference date if needed)
  if (!bestWindowStart || !bestWindowEnd) {
    bestWindowStart = refDate;
    bestWindowEnd = refDate;
  }
  
  const remaining = Math.max(0, 90 - maxUsedDays);
  
  return {
    used: maxUsedDays,
    remaining: remaining,
    windowStart: bestWindowStart.toISOString().split('T')[0],
    windowEnd: bestWindowEnd.toISOString().split('T')[0]
  };
}

/**
 * Calculate Schengen availability for future dates (forecasting)
 * @param {Array} trips - Array of trip objects with country, start_date, end_date
 * @param {string} startDate - Start date for forecasting (YYYY-MM-DD)
 * @param {string} endDate - End date for forecasting (YYYY-MM-DD)
 * @returns {Object} {available, used, remaining, details}
 */
function schengenForecast(trips, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let totalUsed = 0;
  let maxUsedInWindow = 0;
  const details = [];
  
  // Check each day in the forecast period
  for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const windowStart = new Date(currentDate.getTime() - (179 * 24 * 60 * 60 * 1000));
    const windowEnd = currentDate;
    
    let usedInWindow = 0;
    
    for (const trip of trips) {
      if (!SCHENGEN_COUNTRIES.includes(trip.country)) {
        continue;
      }
      
      const tripStart = new Date(trip.start_date);
      const tripEnd = new Date(trip.end_date);
      
      if (tripEnd >= windowStart && tripStart <= windowEnd) {
        const overlapStart = new Date(Math.max(windowStart.getTime(), tripStart.getTime()));
        const overlapEnd = new Date(Math.min(windowEnd.getTime(), tripEnd.getTime()));
        
        if (overlapStart <= overlapEnd) {
          const daysDiff = Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1;
          usedInWindow += daysDiff;
        }
      }
    }
    
    maxUsedInWindow = Math.max(maxUsedInWindow, usedInWindow);
    
    details.push({
      date: dateStr,
      used: usedInWindow,
      remaining: Math.max(0, 90 - usedInWindow)
    });
  }
  
  return {
    available: Math.max(0, 90 - maxUsedInWindow),
    used: maxUsedInWindow,
    remaining: Math.max(0, 90 - maxUsedInWindow),
    details: details
  };
}

/**
 * Get Schengen availability for next 1, 3, and 6 months
 * @param {Array} trips - Array of trip objects
 * @param {string} referenceDate - Reference date (YYYY-MM-DD)
 * @returns {Object} {nextMonth, next3Months, next6Months}
 */
function schengenAvailabilitySummary(trips, referenceDate) {
  const refDate = new Date(referenceDate);
  
  // Calculate next month (30 days)
  const nextMonthStart = new Date(refDate);
  const nextMonthEnd = new Date(refDate);
  nextMonthEnd.setDate(nextMonthEnd.getDate() + 30);
  
  // Calculate next 3 months (90 days)
  const next3MonthsStart = new Date(refDate);
  const next3MonthsEnd = new Date(refDate);
  next3MonthsEnd.setDate(next3MonthsEnd.getDate() + 90);
  
  // Calculate next 6 months (180 days)
  const next6MonthsStart = new Date(refDate);
  const next6MonthsEnd = new Date(refDate);
  next6MonthsEnd.setDate(next6MonthsEnd.getDate() + 180);
  
  return {
    nextMonth: schengenForecast(trips, nextMonthStart.toISOString().split('T')[0], nextMonthEnd.toISOString().split('T')[0]),
    next3Months: schengenForecast(trips, next3MonthsStart.toISOString().split('T')[0], next3MonthsEnd.toISOString().split('T')[0]),
    next6Months: schengenForecast(trips, next6MonthsStart.toISOString().split('T')[0], next6MonthsEnd.toISOString().split('T')[0])
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
  schengenForecast,
  schengenAvailabilitySummary,
  residency183Status,
  getSchengenCountries,
  isSchengenCountry,
  SCHENGEN_COUNTRIES
};
