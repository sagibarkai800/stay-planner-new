const { triggerManualCheck } = require('../cron/schengenAlerts');
const { createUser, listAllUsers, createTrip, deleteTrip } = require('../db');

console.log('🧪 Testing Cron Job System with Real Trip Data\n');

async function testCronWithTrips() {
  console.log('1️⃣ Setting up test data...');
  
  // Get or create test user
  let users = listAllUsers();
  let testUser = users.find(u => u.email === 'test@example.com');
  
  if (!testUser) {
    console.log('   Creating test user...');
    const result = createUser('test@example.com', 'test-hash');
    if (result.success) {
      testUser = { id: result.userId, email: 'test@example.com' };
      console.log(`   ✅ Test user created with ID: ${testUser.id}`);
    } else {
      console.error('   ❌ Failed to create test user:', result.error);
      return;
    }
  } else {
    console.log(`   ✅ Using existing test user: ${testUser.email} (ID: ${testUser.id})`);
  }
  
  // Clean up any existing trips for this user
  console.log('   Cleaning up existing trips...');
  const existingTrips = require('../db').listTripsByUser(testUser.id);
  existingTrips.forEach(trip => {
    deleteTrip(trip.id, testUser.id);
  });
  console.log(`   ✅ Cleaned up ${existingTrips.length} existing trips`);
  
  console.log('\n2️⃣ Creating realistic Schengen trip data to trigger alerts...');
  
  // Create trips that WILL trigger alerts (using more recent dates)
  const today = new Date();
  const trips = [
    // One long trip that uses exactly 90 days
    {
      country: 'FRA',
      startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'France trip for exactly 90 days (should trigger alerts)'
    }
  ];
  
  let createdTrips = 0;
  for (const trip of trips) {
    const result = createTrip(testUser.id, trip.country, trip.startDate, trip.endDate);
    if (result.success) {
      console.log(`   ✅ Created trip: ${trip.description} (ID: ${result.tripId})`);
      createdTrips++;
    } else {
      console.log(`   ❌ Failed to create trip: ${trip.description} - ${result.error}`);
    }
  }
  
  console.log(`\n   📊 Total trips created: ${createdTrips}/${trips.length}`);
  
  console.log('\n3️⃣ Testing Schengen calculations...');
  const { schengenRemainingDays } = require('../lib/rules');
  const userTrips = require('../db').listTripsByUser(testUser.id);
  const schengenStatus = schengenRemainingDays(userTrips, today);
  
  console.log('   Schengen Status for today:');
  console.log(`     - Days used: ${schengenStatus.used}`);
  console.log(`     - Days remaining: ${schengenStatus.remaining}`);
  console.log(`     - Window: ${schengenStatus.windowStart} to ${schengenStatus.windowEnd}`);
  
  // Determine which alerts should trigger
  const thresholds = [15, 7, 3, 0];
  const triggeredAlerts = thresholds.filter(t => schengenStatus.remaining <= t);
  console.log(`     - Alerts that should trigger: ${triggeredAlerts.join(', ')}`);
  
  console.log('\n4️⃣ Testing Manual Cron Trigger with Trip Data...');
  try {
    await triggerManualCheck();
    console.log('   ✅ Manual cron trigger completed successfully');
  } catch (error) {
    console.error('   ❌ Manual cron trigger failed:', error.message);
  }
  
  console.log('\n5️⃣ Summary:');
  console.log(`   - Test user: ${testUser.email}`);
  console.log(`   - Trips created: ${createdTrips}`);
  console.log(`   - Schengen days used: ${schengenStatus.used}`);
  console.log(`   - Schengen days remaining: ${schengenStatus.remaining}`);
  console.log(`   - Expected alerts: ${triggeredAlerts.length > 0 ? triggeredAlerts.join(', ') : 'None'}`);
  
  if (schengenStatus.remaining <= 15) {
    console.log('\n🎯 SUCCESS: The system should have triggered email alerts!');
    console.log('   Check the console output above for email content.');
  } else {
    console.log('\nℹ️  Note: No alerts triggered because remaining days > 15');
    console.log('   You can modify the trip dates to test different scenarios.');
  }
}

// Run the test
testCronWithTrips().catch(console.error);
