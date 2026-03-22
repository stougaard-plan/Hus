const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function init() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
    const seed = fs.readFileSync(path.join(__dirname, '../db/seed.sql'), 'utf8');

    console.log('Running schema...');
    await pool.query(schema);
    console.log('Schema created.');

    // Check if tasks already exist
    const existing = await pool.query('SELECT COUNT(*) FROM tasks');
    if (parseInt(existing.rows[0].count) === 0) {
      console.log('Running seed...');
      await pool.query(seed);
      console.log('Seed data inserted.');
    } else {
      console.log(`Tasks table already has ${existing.rows[0].count} rows, skipping seed.`);
    }

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Database init error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

init();
