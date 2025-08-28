const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database and routes
const db = require('./db');
const authRoutes = require('./routes/auth');
const rulesRoutes = require('./routes/rules');
const tripsRoutes = require('./routes/trips');
const calcsRoutes = require('./routes/calcs');
const docsRoutes = require('./routes/docs');
const staysRoutes = require('./routes/stays');
const telemetryRoutes = require('./routes/telemetry');
const { requireAuth } = require('./middleware/auth');
const { initSchengenAlerts } = require('./cron/schengenAlerts');
const { 
  isFlightProviderEnabled, 
  isBookingEnabled, 
  isAirbnbEnabled 
} = require('./config/providers');

const app = express();
const PORT = process.env.PORT || 4000;

// Log provider configuration
console.log('🔧 Provider Configuration:');
console.log(`  Flights: ${isFlightProviderEnabled() ? 'Skyscanner API enabled' : 'Mock mode (no API key)'}`);
console.log(`  Booking: ${isBookingEnabled() ? 'Affiliate integration enabled' : 'No affiliate ID'}`);
console.log(`  Airbnb: ${isAirbnbEnabled() ? 'Deep links enabled' : 'Deep links disabled'}`);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Stay Planner API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/db/status', (req, res) => {
  try {
    // Test database connection
    const result = db.db.prepare('SELECT 1 as test').get();
    res.json({ 
      ok: true, 
      message: 'Database connected successfully',
      test: result.test 
    });
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

// Provider status endpoint
app.get('/api/providers/status', (req, res) => {
  res.json({
    flights: {
      provider: 'skyscanner',
      enabled: isFlightProviderEnabled(),
      mode: isFlightProviderEnabled() ? 'live' : 'mock'
    },
    accommodation: {
      booking: {
        enabled: isBookingEnabled(),
        affiliateId: isBookingEnabled() ? 'configured' : 'not configured'
      },
      airbnb: {
        deepLinksEnabled: isAirbnbEnabled()
      }
    }
  });
});

// Status endpoint for today's Schengen status
app.get('/api/status/today', requireAuth, (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get user's trips
    const trips = db.listTripsByUser(req.user.id);
    console.log('🔍 Debug - User trips:', trips);
    
    // Calculate remaining days using the rules
    const { schengenRemainingDays, schengenAvailabilitySummary } = require('./lib/rules');
    const schengenResult = schengenRemainingDays(trips, new Date(today));
    console.log('🔍 Debug - Schengen result:', schengenResult);
    
    const remaining = schengenResult.remaining; // Extract the remaining property
    console.log('🔍 Debug - Remaining days:', remaining);
    
    // Get forecasting data
    const forecast = schengenAvailabilitySummary(trips, today);
    
    // Determine status level
    let level = 'ok';
    if (remaining <= 0) {
      level = 'critical';
    } else if (remaining <= 15) {
      level = 'warn';
    }
    
    const response = {
      level,
      remaining,
      date: today,
      currentWindow: {
        start: schengenResult.windowStart,
        end: schengenResult.windowEnd,
        used: schengenResult.used
      },
      forecasting: {
        nextMonth: {
          available: forecast.nextMonth.available,
          used: forecast.nextMonth.used
        },
        next3Months: {
          available: forecast.next3Months.available,
          used: forecast.next3Months.used
        },
        next6Months: {
          available: forecast.next6Months.available,
          used: forecast.next6Months.used
        }
      }
    };
    
    console.log('🔍 Debug - Final response:', response);
    res.json(response);
    
  } catch (error) {
    console.error('Status calculation error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate status',
      level: 'ok',
      remaining: 0
    });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// Rules routes (require authentication)
app.use('/api/rules', rulesRoutes);

// Trips routes (require authentication)
app.use('/api/trips', tripsRoutes);

// Calculations routes (require authentication)
app.use('/api/calcs', calcsRoutes);

// Documents routes (require authentication)
app.use('/api/docs', docsRoutes);

// Stays routes (require authentication)
app.use('/api/stays', staysRoutes);

// Telemetry routes (require authentication)
app.use('/api/telemetry', telemetryRoutes);

// Protected route example
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ 
    message: 'This is a protected route',
    user: req.user 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:4000/api/health`);
  console.log(`🗄️  Database status: http://localhost:4000/api/db/status`);
  console.log(`🔧 Provider status: http://localhost:4000/api/providers/status`);
  console.log(`🔐 Auth endpoints: http://localhost:4000/api/auth`);
  console.log(`📋 Rules endpoints: http://localhost:4000/api/rules`);
  console.log(`✈️  Trips endpoints: http://localhost:4000/api/trips`);
  console.log(`🧮 Calculations endpoints: http://localhost:4000/api/calcs`);
  console.log(`📄 Documents endpoints: http://localhost:4000/api/docs`);
  console.log(`🏨 Stays endpoints: http://localhost:4000/api/stays`);
  console.log(`📊 Telemetry endpoints: http://localhost:4000/api/telemetry`);
  
  // Initialize cron jobs
  initSchengenAlerts();
});
