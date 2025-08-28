/**
 * Server-side validation utilities for trip management
 */

/**
 * Normalize a date to UTC midnight for consistent comparison
 * @param {string|Date} date - Date string or Date object
 * @returns {Date} Date normalized to UTC midnight
 */
function normalizeDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  // Create new date at UTC midnight
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

/**
 * Determine the type of overlap between two date ranges
 * @param {Date} start1 - Start of first range
 * @param {Date} end1 - End of first range
 * @param {Date} start2 - Start of second range
 * @param {Date} end2 - End of second range
 * @returns {string} Type of overlap
 */
function getOverlapType(start1, end1, start2, end2) {
  const normStart1 = normalizeDate(start1);
  const normEnd1 = normalizeDate(end1);
  const normStart2 = normalizeDate(start2);
  const normEnd2 = normalizeDate(end2);
  
  if (normStart1 <= normStart2 && normEnd1 >= normEnd2) {
    return 'completely_contains';
  } else if (normStart2 <= normStart1 && normEnd2 >= normEnd1) {
    return 'completely_contained';
  } else if (normStart1 < normStart2 && normEnd1 >= normStart2) {
    return 'overlaps_start';
  } else if (normStart1 <= normEnd2 && normEnd1 > normEnd2) {
    return 'overlaps_end';
  } else {
    return 'exact_match';
  }
}

/**
 * Check if two date ranges overlap
 * @param {Date} start1 - Start of first range
 * @param {Date} end1 - End of first range
 * @param {Date} start2 - Start of second range
 * @param {Date} end2 - End of second range
 * @returns {boolean} True if ranges overlap (excluding same-day travel)
 */
function datesOverlap(start1, end1, start2, end2) {
  const normStart1 = normalizeDate(start1);
  const normEnd1 = normalizeDate(end1);
  const normStart2 = normalizeDate(start2);
  const normEnd2 = normalizeDate(end2);
  
  // Allow same-day travel: if one trip ends on the same day another starts, that's OK
  // Only count as overlap if there are actual overlapping days
  if (normEnd1.getTime() === normStart2.getTime() || normEnd2.getTime() === normStart1.getTime()) {
    return false; // Same-day travel is allowed
  }
  
  // Two ranges overlap if: start1 <= end2 AND start2 <= end1
  return normStart1 <= normEnd2 && normStart2 <= normEnd1;
}

/**
 * Check if a new trip overlaps with existing trips for the same country
 * @param {Object} newTrip - New trip object { country, start_date, end_date }
 * @param {Array} existingTrips - Array of existing trip objects
 * @param {number} excludeTripId - ID of trip to exclude from check (for updates)
 * @returns {Object} Validation result { isValid, errors, overlappingTrips }
 */
function validateTripOverlap(newTrip, existingTrips, excludeTripId = null) {
  const errors = [];
  const overlappingTrips = [];
  
  // Normalize new trip dates
  const newStart = normalizeDate(newTrip.start_date);
  const newEnd = normalizeDate(newTrip.end_date);
  
  // Validate date order
  if (newStart > newEnd) {
    errors.push('Start date cannot be after end date');
    return { isValid: false, errors, overlappingTrips };
  }
  
  // Check for overlaps with existing trips
  for (const existingTrip of existingTrips) {
    // Skip the trip being updated
    if (excludeTripId && existingTrip.id === excludeTripId) {
      continue;
    }
    
    const existingStart = normalizeDate(existingTrip.start_date);
    const existingEnd = normalizeDate(existingTrip.end_date);
    
    // Check for same-date trips (regardless of country)
    if (newStart.getTime() === existingStart.getTime() && newEnd.getTime() === existingEnd.getTime()) {
      overlappingTrips.push({
        id: existingTrip.id,
        country: existingTrip.country,
        start_date: existingTrip.start_date,
        end_date: existingTrip.end_date,
        overlapType: 'exact_match',
        sameDates: true
      });
      continue; // Skip country-specific overlap check for exact date matches
    }
    
    // Check for overlapping dates (regardless of country)
    if (datesOverlap(newStart, newEnd, existingStart, existingEnd)) {
      overlappingTrips.push({
        id: existingTrip.id,
        country: existingTrip.country,
        start_date: existingTrip.start_date,
        end_date: existingTrip.end_date,
        overlapType: getOverlapType(newStart, newEnd, existingStart, existingEnd),
        sameDates: false
      });
    }
    
    // Check for same-country overlaps (additional validation)
    if (existingTrip.country === newTrip.country) {
      if (datesOverlap(newStart, newEnd, existingStart, existingEnd)) {
        // This will be caught by the general overlap check above
        // We just need to ensure it's marked as same-country
        const existingOverlap = overlappingTrips.find(trip => trip.id === existingTrip.id);
        if (existingOverlap) {
          existingOverlap.sameCountry = true;
        }
      }
    }
  }
  
  // Generate appropriate error messages
  if (overlappingTrips.length > 0) {
    const sameDateTrips = overlappingTrips.filter(trip => trip.sameDates);
    const overlappingDateTrips = overlappingTrips.filter(trip => !trip.sameDates);
    const sameCountryTrips = overlappingTrips.filter(trip => trip.sameCountry);
    
    if (sameDateTrips.length > 0) {
      errors.push(`You cannot have multiple trips on the exact same dates (${newTrip.start_date} to ${newTrip.end_date})`);
    } else if (sameCountryTrips.length > 0) {
      errors.push(`This trip overlaps with ${sameCountryTrips.length} existing trip(s) in ${newTrip.country}`);
    } else if (overlappingDateTrips.length > 0) {
      errors.push(`This trip overlaps with ${overlappingDateTrips.length} existing trip(s) on overlapping dates`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    overlappingTrips
  };
}

/**
 * Validate trip data format and required fields
 * @param {Object} trip - Trip object to validate
 * @returns {Object} Validation result { isValid, errors }
 */
function validateTripData(trip) {
  const errors = [];
  
  // Required fields
  if (!trip.country || trip.country.trim() === '') {
    errors.push('Country is required');
  }
  
  if (!trip.start_date) {
    errors.push('Start date is required');
  }
  
  if (!trip.end_date) {
    errors.push('End date is required');
  }
  
  // Date format validation
  if (trip.start_date && trip.end_date) {
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    
    if (isNaN(startDate.getTime())) {
      errors.push('Invalid start date format');
    }
    
    if (isNaN(endDate.getTime())) {
      errors.push('Invalid end date format');
    }
    
    // Date order validation
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate > endDate) {
      errors.push('Start date cannot be after end date');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateTripData,
  validateTripOverlap,
  normalizeDate,
  datesOverlap
};
