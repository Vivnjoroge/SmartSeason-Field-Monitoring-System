// PostgreSQL connection pool configuration for SmartSeason backend.
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
