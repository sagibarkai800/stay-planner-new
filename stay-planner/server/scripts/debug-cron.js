const { listAllUsers, listTripsByUser } = require('../db');

console.log('🔍 Debugging Cron System\n');

console.log('1️⃣ All users in database:');
const users = listAllUsers();
users.forEach((user, index) => {
  console.log(`   ${index + 1}. ID: ${user.id}, Email: ${user.email}, Created: ${user.created_at}`);
});

console.log('\n2️⃣ Trips for each user:');
users.forEach((user, index) => {
  const trips = listTripsByUser(user.id);
  console.log(`   ${index + 1}. ${user.email}: ${trips.length} trips`);
  
  if (trips.length > 0) {
    trips.forEach((trip, tripIndex) => {
      console.log(`      Trip ${tripIndex + 1}: ${trip.country} (${trip.start_date} to ${trip.end_date})`);
    });
  }
});

console.log('\n3️⃣ Testing specific user lookup:');
const testUser = users.find(u => u.email === 'test@example.com');
if (testUser) {
  console.log(`   Test user found: ID ${testUser.id}, Email: ${testUser.email}`);
  const testUserTrips = listTripsByUser(testUser.id);
  console.log(`   Test user has ${testUserTrips.length} trips`);
  
  if (testUserTrips.length > 0) {
    console.log('   Trip details:');
    testUserTrips.forEach((trip, index) => {
      console.log(`     ${index + 1}. ${trip.country}: ${trip.start_date} to ${trip.end_date}`);
    });
  }
} else {
  console.log('   ❌ Test user not found!');
}

console.log('\n4️⃣ Database connection test:');
try {
  const db = require('../db').db;
  const result = db.prepare('SELECT COUNT(*) as userCount FROM users').get();
  console.log(`   Total users in database: ${result.userCount}`);
  
  const tripCount = db.prepare('SELECT COUNT(*) as tripCount FROM trips').get();
  console.log(`   Total trips in database: ${tripCount.tripCount}`);
  
  const testUserTripsCount = db.prepare('SELECT COUNT(*) as tripCount FROM trips WHERE user_id = ?').get(testUser ? testUser.id : 0);
  console.log(`   Trips for test user: ${testUserTripsCount.tripCount}`);
  
} catch (error) {
  console.error('   ❌ Database error:', error.message);
}
