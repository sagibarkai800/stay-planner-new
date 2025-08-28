/**
 * Shared Utility Functions
 * Common utilities for date handling, validation, and formatting
 */

/**
 * Parse and normalize date string to UTC midnight
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Date} Normalized Date object at UTC midnight
 */
const parseDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') {
    throw new Error('Invalid date string');
  }
  
  const date = new Date(dateStr + 'T00:00:00.000Z');
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }
  
  return date;
};

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date object');
  }
  
  return date.toISOString().split('T')[0];
};

/**
 * Check if date is in the future (after today)
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
const isFutureDate = (date) => {
  const checkDate = typeof date === 'string' ? parseDate(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return checkDate > today;
};

/**
 * Check if date is in the past (before today)
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
const isPastDate = (date) => {
  const checkDate = typeof date === 'string' ? parseDate(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return checkDate < today;
};

/**
 * Calculate days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days between dates
 */
const daysBetween = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Validate date range (start < end)
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {boolean} True if valid date range
 */
const isValidDateRange = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  
  return start < end;
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date string
 */
const getToday = () => {
  return formatDate(new Date());
};

/**
 * Get date X days from today
 * @param {number} days - Number of days to add/subtract
 * @returns {string} Date string
 */
const getDateFromToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

/**
 * Validate required fields in an object
 * @param {Object} data - Object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid and errors
 */
const validateRequiredFields = (data, requiredFields) => {
  const errors = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate numeric range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {string} fieldName - Name of field for error message
 * @returns {Object} Validation result
 */
const validateNumericRange = (value, min, max, fieldName) => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`
    };
  }
  
  if (num < min || num > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`
    };
  }
  
  return { isValid: true };
};

/**
 * Sanitize string input (remove extra whitespace, trim)
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/\s+/g, ' ');
};

/**
 * Create a standardized error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {Object} Standardized error response
 */
const createErrorResponse = (message, statusCode = 400, details = {}) => {
  return {
    success: false,
    error: message,
    statusCode,
    details,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create a standardized success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Standardized success response
 */
const createSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  // Date utilities
  parseDate,
  formatDate,
  isFutureDate,
  isPastDate,
  daysBetween,
  isValidDateRange,
  getToday,
  getDateFromToday,
  
  // Validation utilities
  validateRequiredFields,
  validateNumericRange,
  sanitizeString,
  
  // Response utilities
  createErrorResponse,
  createSuccessResponse
};
