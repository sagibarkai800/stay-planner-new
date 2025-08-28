const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { createErrorResponse, createSuccessResponse } = require('../utils/shared');

class TelemetryService {
  constructor() {
    this.logsDir = path.join(__dirname, '..', 'logs');
    this.telemetryFile = path.join(this.logsDir, 'telemetry.log');
    this.ensureLogsDirectory();
  }

  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  hashUserId(userId) {
    if (!userId) return null;
    return crypto.createHash('sha256').update(userId.toString()).digest('hex').substring(0, 8);
  }

  sanitizeParams(params) {
    if (!params || typeof params !== 'object') return null;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string' && value.length > 0) {
        // Keep parameter names but hash values to avoid PII
        sanitized[key] = crypto.createHash('sha256').update(value).digest('hex').substring(0, 8);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        // Keep non-PII data types as-is
        sanitized[key] = value;
      } else if (Array.isArray(value)) {
        // Handle arrays by showing length and type
        sanitized[key] = `array[${value.length}]`;
      } else if (value && typeof value === 'object') {
        // Handle nested objects
        sanitized[key] = this.sanitizeParams(value);
      }
    }
    return sanitized;
  }

  logEvent(eventType, params = {}, userId = null, mockMode = false) {
    const event = {
      timestamp: new Date().toISOString(),
      event: eventType,
      userIdHash: this.hashUserId(userId),
      params: this.sanitizeParams(params),
      mockMode,
      environment: process.env.NODE_ENV || 'development'
    };

    const logLine = JSON.stringify(event) + '\n';
    
    try {
      fs.appendFileSync(this.telemetryFile, logLine);
    } catch (error) {
      console.error('Failed to write telemetry log:', error.message);
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Telemetry:', event);
    }
  }

  // Specific event methods
  logFlightsSearch(params, userId, mockMode) {
    this.logEvent('flights_search', params, userId, mockMode);
  }

  logFlightsClick(params, userId, mockMode) {
    this.logEvent('flights_click', params, userId, mockMode);
  }

  logStaysLinks(params, userId, mockMode) {
    this.logEvent('stays_links', params, userId, mockMode);
  }

  logUIEvent(eventType, params, userId) {
    this.logEvent(`ui_${eventType}`, params, userId, false);
  }
}

module.exports = new TelemetryService();
