require('dotenv').config();

console.log('=== Environment Variables Debug ===');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'undefined');
console.log('DB_PASSWORD first char:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.charCodeAt(0) : 'undefined');
console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('DB')));
console.log('================================');