const nodemailer = require('nodemailer');

// SMTP configuration from environment variables
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create transporter
let transporter = null;

// Initialize transporter if SMTP config is available
if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    transporter = nodemailer.createTransporter(smtpConfig);
    console.log('✅ SMTP transporter initialized successfully');
  } catch (error) {
    console.error('❌ Failed to create SMTP transporter:', error.message);
  }
} else {
  console.log('⚠️  SMTP configuration missing. Email alerts will be logged to console only.');
  console.log('   Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM');
}

/**
 * Send email alert to user
 * @param {Object} user - User object with email
 * @param {Object} payload - Email content
 * @param {string} payload.subject - Email subject
 * @param {string} payload.html - Email HTML content
 * @param {string} payload.text - Email plain text content
 */
async function sendAlert(user, payload) {
  if (!transporter) {
    // Log to console if SMTP is not configured
    console.log('📧 EMAIL ALERT (SMTP not configured):');
    console.log(`   To: ${user.email}`);
    console.log(`   Subject: ${payload.subject}`);
    console.log(`   Content: ${payload.text || payload.html}`);
    return { success: false, reason: 'SMTP not configured' };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${user.email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${user.email}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test SMTP connection
 */
async function testConnection() {
  if (!transporter) {
    return { success: false, reason: 'SMTP not configured' };
  }

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendAlert,
  testConnection,
};
