import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'info@infiniteclothingstore.co.uk';

if (!SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY is not set');
  process.exit(1);
}

sgMail.setApiKey(SENDGRID_API_KEY);

console.log('✅ SendGrid API Key is set');
console.log('📧 From Email:', FROM_EMAIL);
console.log('🔑 API Key (first 10 chars):', SENDGRID_API_KEY.substring(0, 10) + '...');

// Test email
const testEmail = process.argv[2];
if (!testEmail) {
  console.log('\n⚠️  No test email provided. Usage: node test-sendgrid.js your@email.com');
  process.exit(0);
}

console.log('\n📤 Sending test email to:', testEmail);

sgMail.send({
  to: testEmail,
  from: FROM_EMAIL,
  subject: 'Test Email from INF!NITE C107HING',
  html: '<h1>Test Email</h1><p>If you received this, SendGrid is working correctly!</p>',
})
.then(() => {
  console.log('✅ Test email sent successfully!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Failed to send test email:');
  console.error(error.response ? error.response.body : error);
  process.exit(1);
});
