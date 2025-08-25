const cron = require('node-cron');
const { sendAlert } = require('../mail/sendAlert');
const { schengenRemainingDays } = require('../lib/rules');
const { listAllUsers, listTripsByUser } = require('../db');

// Thresholds for email alerts (in days)
const ALERT_THRESHOLDS = [15, 7, 3, 0];

// Track last alert sent to avoid spam
const lastAlertSent = new Map(); // userId -> { threshold: number, date: string }

/**
 * Generate email content for Schengen alert
 */
function generateEmailContent(user, schengenStatus, threshold) {
  const { used, remaining, windowStart, windowEnd } = schengenStatus;
  
  const subject = `🚨 Schengen Alert: ${remaining} days remaining`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">🚨 Schengen Compliance Alert</h2>
      
      <p>Hello ${user.email},</p>
      
      <p>This is an important reminder about your Schengen compliance status:</p>
      
      <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #e65100;">⚠️ ${remaining} days remaining</h3>
        
        <p><strong>Current status:</strong></p>
        <ul>
          <li>Days used in current window: <strong>${used}</strong></li>
          <li>Days remaining: <strong>${remaining}</strong></li>
          <li>Current window: ${new Date(windowStart).toLocaleDateString()} - ${new Date(windowEnd).toLocaleDateString()}</li>
        </ul>
      </div>
      
      <p><strong>Action required:</strong> Please plan your travel accordingly to avoid exceeding the 90-day limit.</p>
      
      <p>Best regards,<br>Stay Planner Team</p>
    </div>
  `;
  
  const text = `
Schengen Compliance Alert

Hello ${user.email},

This is an important reminder about your Schengen compliance status:

⚠️ ${remaining} days remaining

Current status:
- Days used in current window: ${used}
- Days remaining: ${remaining}
- Current window: ${new Date(windowStart).toLocaleDateString()} - ${new Date(windowEnd).toLocaleDateString()}

Action required: Please plan your travel accordingly to avoid exceeding the 90-day limit.

Best regards,
Stay Planner Team
  `;
  
  return { subject, html, text };
}

/**
 * Check if we should send an alert for this threshold
 */
function shouldSendAlert(userId, threshold, currentDate) {
  const lastAlert = lastAlertSent.get(userId);
  
  if (!lastAlert) {
    return true; // First time alerting this user
  }
  
  // Don't send the same threshold alert twice in the same day
  if (lastAlert.threshold === threshold && lastAlert.date === currentDate) {
    return false;
  }
  
  // For threshold 0, only send once per day
  if (threshold === 0 && lastAlert.date === currentDate) {
    return false;
  }
  
  return true;
}

/**
 * Process Schengen alerts for all users
 */
async function processSchengenAlerts() {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  console.log(`\n🕘 [${new Date().toISOString()}] Processing daily Schengen alerts...`);
  
  try {
    // Get all users
    const users = listAllUsers();
    console.log(`📊 Found ${users.length} users to check`);
    
    let alertsSent = 0;
    let errors = 0;
    
    for (const user of users) {
      try {
        console.log(`   Processing user: ${user.email} (ID: ${user.id})`);
        
        // Get user's trips
        const trips = listTripsByUser(user.id);
        console.log(`     Found ${trips.length} trips`);
        
        if (trips.length === 0) {
          console.log(`   ${user.email}: No trips found, skipping`);
          continue;
        }
        
        // Calculate Schengen status for today
        const schengenStatus = schengenRemainingDays(trips, new Date());
        console.log(`     Schengen status: ${schengenStatus.used} days used, ${schengenStatus.remaining} days remaining`);
        
        // Check each threshold
        for (const threshold of ALERT_THRESHOLDS) {
          if (schengenStatus.remaining <= threshold && shouldSendAlert(user.id, threshold, currentDate)) {
            console.log(`     🚨 Alert threshold ${threshold} triggered!`);
            // Generate and send alert
            const emailContent = generateEmailContent(user, schengenStatus, threshold);
            const result = await sendAlert(user, emailContent);
            
            if (result.success) {
              console.log(`   ✅ Alert sent to ${user.email}: ${threshold} days remaining`);
              alertsSent++;
              
              // Update last alert sent
              lastAlertSent.set(user.id, { threshold, date: currentDate });
            } else {
              console.log(`   ❌ Failed to send alert to ${user.email}: ${result.reason || result.error}`);
              errors++;
            }
          } else {
            console.log(`     Threshold ${threshold}: ${schengenStatus.remaining} > ${threshold}, no alert`);
          }
        }
        
      } catch (error) {
        console.error(`   ❌ Error processing user ${user.email}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n📈 Daily Schengen alerts completed:`);
    console.log(`   ✅ Alerts sent: ${alertsSent}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Users processed: ${users.length}`);
    
  } catch (error) {
    console.error('❌ Critical error in daily Schengen alerts:', error.message);
  }
}

/**
 * Initialize the cron job
 */
function initSchengenAlerts() {
  // Schedule daily job at 09:00
  const cronJob = cron.schedule('0 9 * * *', processSchengenAlerts, {
    scheduled: true,
    timezone: 'UTC' // You can change this to your server's timezone
  });
  
  console.log('⏰ Daily Schengen alerts cron job scheduled for 09:00 UTC');
  
  // For testing: run immediately if NODE_ENV is development
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Development mode: Running initial Schengen check...');
    setTimeout(processSchengenAlerts, 2000); // Wait 2 seconds for server to fully start
  }
  
  return cronJob;
}

/**
 * Manual trigger for testing
 */
async function triggerManualCheck() {
  console.log('🔧 Manual trigger of Schengen alerts...');
  await processSchengenAlerts();
}

module.exports = {
  initSchengenAlerts,
  processSchengenAlerts,
  triggerManualCheck,
};
