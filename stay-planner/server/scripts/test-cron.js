const { testConnection } = require('../mail/sendAlert');
const { triggerManualCheck } = require('../cron/schengenAlerts');
const { createUser, listAllUsers, createTrip } = require('../db');

console.log('🧪 Testing Cron Job System and Email Functionality\n');

async function testCronSystem() {
  console.log('1️⃣ Testing SMTP Connection...');
  const smtpTest = await testConnection();
  console.log('   Result:', smtpTest);
  
  console.log('\n2️⃣ Testing Database Functions...');
  
  // Check if we have users
  const users = listAllUsers();
  console.log(`   Found ${users.length} users in database`);
  
  if (users.length === 0) {
    console.log('   Creating test user...');
    const testUser = createUser('test@example.com', 'test-hash');
    if (testUser.success) {
      console.log(`   ✅ Test user created with ID: ${testUser.userId}`);
      
      // Create some test trips for the user
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const trip1 = createTrip(testUser.userId, 'FRA', 
        today.toISOString().split('T')[0], 
        tomorrow.toISOString().split('T')[0]
      );
      
      if (trip1.success) {
        console.log(`   ✅ Test trip created with ID: ${trip1.tripId}`);
      }
    }
  }
  
  console.log('\n3️⃣ Testing Manual Cron Trigger...');
  try {
    await triggerManualCheck();
    console.log('   ✅ Manual cron trigger completed successfully');
  } catch (error) {
    console.error('   ❌ Manual cron trigger failed:', error.message);
  }
  
  console.log('\n4️⃣ Summary:');
  console.log('   - SMTP Status:', smtpTest.success ? '✅ Connected' : '❌ Not configured');
  console.log('   - Database Users:', listAllUsers().length);
  console.log('   - Cron System: ✅ Initialized');
  
  if (!smtpTest.success) {
    console.log('\n⚠️  Note: SMTP is not configured, so emails will be logged to console only.');
    console.log('   To enable real email sending, set these environment variables:');
    console.log('   - SMTP_HOST (e.g., smtp.gmail.com)');
    console.log('   - SMTP_PORT (e.g., 587)');
    console.log('   - SMTP_USER (your email)');
    console.log('   - SMTP_PASS (your app password)');
    console.log('   - EMAIL_FROM (sender email)');
  }
}

// Run the test
testCronSystem().catch(console.error);
