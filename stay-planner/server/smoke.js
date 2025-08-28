#!/usr/bin/env node

/**
 * Server Smoke Test
 * Tests all critical API endpoints and returns exit code 0/1 accordingly
 */

const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const TIMEOUT = 10000;

// Test results tracking
let testsPassed = 0;
let testsFailed = 0;
let totalTests = 0;

// Utility functions
const makeRequest = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: TIMEOUT
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
};

const test = (name, testFn) => {
  totalTests++;
  console.log(`\n🧪 Testing: ${name}`);
  
  return testFn()
    .then(() => {
      console.log(`✅ PASS: ${name}`);
      testsPassed++;
    })
    .catch((error) => {
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Error: ${error.message}`);
      testsFailed++;
    });
};

const runTests = async () => {
  console.log('🚀 Starting Server Smoke Tests...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`⏱️  Timeout: ${TIMEOUT}ms`);

  // Test 1: Health check
  await test('Health Check', async () => {
    const response = await makeRequest('/api/health');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.ok) {
      throw new Error('Health check returned not ok');
    }
  });

  // Test 2: Database status
  await test('Database Status', async () => {
    const response = await makeRequest('/api/db/status');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.ok) {
      throw new Error('Database check returned not ok');
    }
  });

  // Test 3: Provider status
  await test('Provider Status', async () => {
    const response = await makeRequest('/api/providers/status');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.flights || !response.data.accommodation) {
      throw new Error('Provider status missing required fields');
    }
  });

  // Test 4: Feature flags
  await test('Feature Flags', async () => {
    const response = await makeRequest('/api/features/status');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.flights || !response.data.stays) {
      throw new Error('Feature flags missing required fields');
    }
  });

  // Test 5: Flights search (mock mode)
  await test('Flights Search Mock Mode', async () => {
    const response = await makeRequest('/api/flights/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        origin: 'LON',
        destination: 'PAR',
        depart: '2025-09-01',
        return: '2025-09-05',
        adults: 2
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.flights || !Array.isArray(response.data.flights)) {
      throw new Error('Flights search should return flights array');
    }
    
    // Check if it's mock mode
    if (response.data.mode !== 'mock') {
      console.log('   Note: Running in live mode (not mock)');
    }
  });

  // Test 6: Flights redirect
  await test('Flights Redirect', async () => {
    const response = await makeRequest('/api/flights/redirect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        provider: 'skyscanner',
        url: 'https://example.com/flight'
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.url || typeof response.data.url !== 'string') {
      throw new Error('Flights redirect should return URL');
    }
  });

  // Test 7: Stays links
  await test('Stays Links', async () => {
    const response = await makeRequest('/api/stays/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        destination: 'Paris',
        checkin: '2025-09-01',
        checkout: '2025-09-05',
        adults: 2
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.bookingUrl) {
      throw new Error('Stays links should return Booking.com URL');
    }
    
    // Check if Airbnb is enabled
    if (response.data.airbnbUrl) {
      console.log('   Note: Airbnb deep links enabled');
    } else {
      console.log('   Note: Airbnb deep links disabled');
    }
  });

  // Test 8: Telemetry health
  await test('Telemetry Health', async () => {
    const response = await makeRequest('/api/telemetry/health');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.status || response.data.status !== 'healthy') {
      throw new Error('Telemetry health check failed');
    }
  });

  // Test 9: Stays test endpoint
  await test('Stays Test Endpoint', async () => {
    const response = await makeRequest('/api/stays/test');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.message || !response.data.timestamp) {
      throw new Error('Stays test endpoint missing required fields');
    }
  });

  // Summary
  console.log('\n📊 Test Results:');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${testsPassed}`);
  console.log(`   Failed: ${testsFailed}`);
  console.log(`   Success Rate: ${((testsPassed / totalTests) * 100).toFixed(1)}%`);

  // Exit with appropriate code
  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed! Server is healthy.');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed. Server may have issues.');
    process.exit(1);
  }
};

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run tests
runTests().catch((error) => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
