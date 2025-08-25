const bcrypt = require('bcrypt');
const db = require('./db.js');

async function testAuth() {
  console.log('🔐 Testing Authentication System...\n');
  
  // Test 1: Create a new test user
  console.log('1. Creating a new test user...');
  const testEmail = 'testlogin@example.com';
  const testPassword = 'password123';
  
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(testPassword, 12);
    
    // Create user
    const result = db.createUser(testEmail, passwordHash);
    console.log('Create user result:', result);
    
    if (result.success) {
      console.log('✅ User created successfully with ID:', result.userId);
      
      // Test 2: Find the user
      console.log('\n2. Finding the created user...');
      const user = db.findUserByEmail(testEmail);
      console.log('Found user:', user ? { id: user.id, email: user.email } : 'Not found');
      
      // Test 3: Test password verification
      if (user) {
        console.log('\n3. Testing password verification...');
        const isValid = await bcrypt.compare(testPassword, user.password_hash);
        console.log('Password verification result:', isValid);
        
        if (isValid) {
          console.log('🎉 SUCCESS: Authentication is working correctly!');
        } else {
          console.log('❌ FAILED: Password verification failed');
        }
      }
    } else {
      console.log('❌ Failed to create user:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Error during test:', error.message);
  }
  
  console.log('\n🎯 Authentication test complete!');
}

testAuth().catch(console.error);
