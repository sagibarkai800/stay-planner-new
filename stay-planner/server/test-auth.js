const bcrypt = require('bcrypt');
const db = require('./db.js');

async function testAuth() {
  console.log('🔐 Testing Authentication System...\n');
  
  // Test 1: Check if we can find users
  console.log('1. Checking users in database:');
  const users = db.listAllUsers();
  console.log(users);
  
  // Test 2: Try to find a specific user
  console.log('\n2. Looking for sagi@gmail.com:');
  const user = db.findUserByEmail('sagi@gmail.com');
  if (user) {
    console.log('✅ User found:', { id: user.id, email: user.email, created_at: user.created_at });
  } else {
    console.log('❌ User not found');
  }
  
  // Test 3: Test password verification
  if (user) {
    console.log('\n3. Testing password verification:');
    console.log('Note: We cannot verify the actual password hash without knowing the original password');
    console.log('Password hash exists:', !!user.password_hash);
    console.log('Hash length:', user.password_hash ? user.password_hash.length : 'N/A');
  }
  
  // Test 4: Create a new test user with known password
  console.log('\n4. Creating a new test user:');
  try {
    const testEmail = 'testauth@example.com';
    const testPassword = 'password123';
    
    // Check if user already exists
    const existingUser = db.findUserByEmail(testEmail);
    if (existingUser) {
      console.log('User already exists, testing login...');
      // Try to verify password
      const isValid = await bcrypt.compare(testPassword, existingUser.password_hash);
      console.log('Password verification result:', isValid);
    } else {
      console.log('Creating new test user...');
      const newUser = db.createUser(testEmail, testPassword);
      console.log('✅ New user created:', { id: newUser.id, email: newUser.email });
    }
  } catch (error) {
    console.log('❌ Error creating user:', error.message);
  }
  
  console.log('\n🎯 Authentication test complete!');
}

testAuth().catch(console.error);
