const axios = require('axios');

const BASE_URL = 'http://localhost:4000';
let authCookie = '';

console.log('🧪 Testing Stay Planner API Endpoints...\n');

// Helper function to make authenticated requests
async function makeAuthRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };

    if (data) {
      config.data = data;
    }

    if (authCookie) {
      config.headers.Cookie = authCookie;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}

// Test 1: Health check
async function testHealth() {
  console.log('1️⃣ Testing Health Check:');
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', response.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
}

// Test 2: User registration
async function testRegistration() {
  console.log('\n2️⃣ Testing User Registration:');
  try {
    const userData = {
      email: 'testuser@example.com',
      password: 'password123'
    };

    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData, {
      withCredentials: true
    });

    if (response.headers['set-cookie']) {
      authCookie = response.headers['set-cookie'][0];
      console.log('✅ Registration successful, cookie set');
    } else {
      console.log('⚠️  Registration successful but no cookie received');
    }

    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Registration response:', error.response.data);
    } else {
      console.log('❌ Registration failed:', error.message);
    }
  }
}

// Test 3: User login
async function testLogin() {
  console.log('\n3️⃣ Testing User Login:');
  try {
    const userData = {
      email: 'testuser@example.com',
      password: 'password123'
    };

    const response = await axios.post(`${BASE_URL}/api/auth/login`, userData, {
      withCredentials: true
    });

    if (response.headers['set-cookie']) {
      authCookie = response.headers['set-cookie'][0];
      console.log('✅ Login successful, cookie set');
    } else {
      console.log('⚠️  Login successful but no cookie received');
    }

    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Login response:', error.response.data);
    } else {
      console.log('❌ Login failed:', error.message);
    }
  }
}

// Test 4: Create trips
async function testCreateTrips() {
  console.log('\n4️⃣ Testing Trip Creation:');
  
  const trips = [
    {
      country: 'FRA',
      start_date: '2024-06-01',
      end_date: '2024-06-15'
    },
    {
      country: 'ITA',
      start_date: '2024-07-01',
      end_date: '2024-07-20'
    },
    {
      country: 'ESP',
      start_date: '2024-08-01',
      end_date: '2024-08-10'
    }
  ];

  for (let i = 0; i < trips.length; i++) {
    try {
      const response = await makeAuthRequest('POST', '/api/trips', trips[i]);
      console.log(`✅ Trip ${i + 1} created:`, response);
    } catch (error) {
      console.log(`❌ Trip ${i + 1} creation failed:`, error.message);
    }
  }
}

// Test 5: Get trips
async function testGetTrips() {
  console.log('\n5️⃣ Testing Get Trips:');
  try {
    const response = await makeAuthRequest('GET', '/api/trips');
    console.log('✅ Trips retrieved:', response);
  } catch (error) {
    console.log('❌ Get trips failed:', error.message);
  }
}

// Test 6: Schengen calculation
async function testSchengenCalc() {
  console.log('\n6️⃣ Testing Schengen Calculation:');
  try {
    const response = await makeAuthRequest('GET', '/api/calcs/schengen?date=2024-08-15');
    console.log('✅ Schengen calculation:', response);
  } catch (error) {
    console.log('❌ Schengen calculation failed:', error.message);
  }
}

// Test 7: Residency calculation
async function testResidencyCalc() {
  console.log('\n7️⃣ Testing Residency Calculation:');
  try {
    const response = await makeAuthRequest('GET', '/api/calcs/residency?year=2024');
    console.log('✅ Residency calculation:', response);
  } catch (error) {
    console.log('❌ Residency calculation failed:', error.message);
  }
}

// Test 8: Summary calculation
async function testSummaryCalc() {
  console.log('\n8️⃣ Testing Summary Calculation:');
  try {
    const response = await makeAuthRequest('GET', '/api/calcs/summary');
    console.log('✅ Summary calculation:', response);
  } catch (error) {
    console.log('❌ Summary calculation failed:', error.message);
  }
}

// Test 9: Update trip
async function testUpdateTrip() {
  console.log('\n9️⃣ Testing Trip Update:');
  try {
    const updateData = {
      end_date: '2024-06-20'
    };
    const response = await makeAuthRequest('PUT', '/api/trips/1', updateData);
    console.log('✅ Trip updated:', response);
  } catch (error) {
    console.log('❌ Trip update failed:', error.message);
  }
}

// Test 10: Delete trip
async function testDeleteTrip() {
  console.log('\n🔟 Testing Trip Deletion:');
  try {
    const response = await makeAuthRequest('DELETE', '/api/trips/3');
    console.log('✅ Trip deleted:', response);
  } catch (error) {
    console.log('❌ Trip deletion failed:', error.message);
  }
}

// Test 11: Error handling
async function testErrorHandling() {
  console.log('\n1️⃣1️⃣ Testing Error Handling:');
  
  // Test invalid date format
  try {
    const response = await makeAuthRequest('GET', '/api/calcs/schengen?date=invalid-date');
    console.log('Invalid date response:', response);
  } catch (error) {
    console.log('❌ Invalid date test failed:', error.message);
  }

  // Test missing required fields
  try {
    const response = await makeAuthRequest('POST', '/api/trips', { country: 'FRA' });
    console.log('Missing fields response:', response);
  } catch (error) {
    console.log('❌ Missing fields test failed:', error.message);
  }

  // Test invalid country format
  try {
    const response = await makeAuthRequest('POST', '/api/trips', {
      country: 'INVALID',
      start_date: '2024-09-01',
      end_date: '2024-09-10'
    });
    console.log('Invalid country response:', response);
  } catch (error) {
    console.log('❌ Invalid country test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  try {
    await testHealth();
    await testRegistration();
    await testLogin();
    await testCreateTrips();
    await testGetTrips();
    await testSchengenCalc();
    await testResidencyCalc();
    await testSummaryCalc();
    await testUpdateTrip();
    await testDeleteTrip();
    await testErrorHandling();
    
    console.log('\n🎯 All API Endpoint Tests Complete!');
    console.log('Check the results above to verify all endpoints are working correctly.');
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Check if axios is available, if not, provide instructions
try {
  require('axios');
  runAllTests();
} catch (error) {
  console.log('❌ Axios not found. Please install it first:');
  console.log('npm install axios');
  console.log('\nThen run this test script again.');
}
