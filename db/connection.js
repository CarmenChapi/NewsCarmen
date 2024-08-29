const pg = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set');
}

const pgConfig = {};
if(ENV === "production"){
  pgConfig.connectionString = process.env.DATABASE_URL
  pgConfig.max = 2
}
const { Pool } = pg;

module.exports = new Pool(pgConfig);

