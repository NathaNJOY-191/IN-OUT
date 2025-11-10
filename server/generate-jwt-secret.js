// Simple script to generate a secure JWT secret
// Run with: node generate-jwt-secret.js

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');

console.log('\n=================================');
console.log('Generated JWT Secret:');
console.log('=================================');
console.log(secret);
console.log('=================================');
console.log('\nCopy this value and use it as your JWT_SECRET environment variable in Render');
console.log('\n');
