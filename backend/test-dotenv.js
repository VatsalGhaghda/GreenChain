console.log('=== Before dotenv ===');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

console.log('\n=== Loading dotenv with explicit path ===');
const path = require('path');
const dotenv = require('dotenv');

const result = dotenv.config({ 
  path: path.join(__dirname, '.env'),
  debug: true 
});

console.log('Dotenv result:', result);
console.log('Dotenv error:', result.error);

console.log('\n=== After dotenv ===');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

console.log('\n=== All environment variables ===');
Object.keys(process.env).forEach(key => {
  if (key.includes('DB') || key.includes('PORT')) {
    console.log(`${key}: ${process.env[key]}`);
  }
});