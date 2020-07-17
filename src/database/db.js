require('dotenv').config();
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env;

const config = {
  client: DB_DIALECT,
  debug: false,
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  },
  pool: { min: 0, max: 100 }
};

module.exports = require('knex')(config);