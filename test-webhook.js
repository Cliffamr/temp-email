const crypto = require('crypto');
const https = require('https');

// Configuration
const WEBHOOK_URL = 'https://www.cliffamr.engineer/api/webhooks/inbound-email';
const SECRET = '2b60da5bfe0e2343d46026ff2663655774eb43a7d054137f57370fa34d7e5';
const TEST_EMAIL = 'puki@kalana.indevs.in';
const TEST_SENDER = 'test-script@example.com';

// Payload (Updated structure from Worker v2)
const payload = JSON.stringify({
    to: TEST_EMAIL,
    from: TEST_SENDER,
    subject: 'Test Email from Terminal Script (Post Refactor)',
    date: new Date().toISOString(),
    text: 'This is a test email sent via Node.js script to verify the webhook after refactoring parsing logic to Worker.',
    html: '<p>This is a <strong>test email</strong> sent via Node.js script to verify the webhook after refactoring parsing logic to Worker.</p>',
    raw: '' // Empty raw
});

// Generate Signature
const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');

console.log('Sending webhook request...');
console.log('URL:', WEBHOOK_URL);
console.log('Signature:', signature);

// Send Request
const req = https.request(WEBHOOK_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature,
        'User-Agent': 'TestScript/1.0'
    }
}, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Response Body:', data);
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Webhook verification SUCCESS!');
        } else {
            console.error('❌ Webhook verification FAILED');
        }
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.write(payload);
req.end();
