require('dotenv').config();
const db = require('./src/config/database');

async function checkDatabase() {
  try {
    console.log('=== Database Content Check ===\n');
    
    // Check users
    const users = await db.query('SELECT * FROM users');
    console.log('Users:', users.rows.length);
    users.rows.forEach(user => {
      console.log(`  - ${user.name} (${user.role}) - ${user.address}`);
    });
    
    // Check batches
    const batches = await db.query('SELECT * FROM batches');
    console.log('\nBatches:', batches.rows.length);
    batches.rows.forEach(batch => {
      console.log(`  - ${batch.batch_id} (${batch.status}) - ${batch.amount_kg}kg`);
    });
    
    // Check events
    const events = await db.query('SELECT * FROM events');
    console.log('\nEvents:', events.rows.length);
    events.rows.forEach(event => {
      console.log(`  - ${event.event_type} - ${event.batch_id || event.token_id}`);
    });
    
    // Check marketplace listings
    const listings = await db.query('SELECT * FROM marketplace_listings');
    console.log('\nMarketplace Listings:', listings.rows.length);
    listings.rows.forEach(listing => {
      console.log(`  - Token ${listing.token_id} - ${listing.amount} credits - $${listing.price}`);
    });
    
    // Check certificates
    const certificates = await db.query('SELECT * FROM certificates');
    console.log('\nCertificates:', certificates.rows.length);
    certificates.rows.forEach(cert => {
      console.log(`  - Token ${cert.token_id} - Batch ${cert.batch_id}`);
    });
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await db.end();
  }
}

checkDatabase();
