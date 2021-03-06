// Update with your config settings.
require('dotenv/config');
const Url = require('url-parse');
const CLEARDB_DATABASE_URL = new Url(process.env.CLEARDB_DATABASE_URL);

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'mysql',
    connection: {
      database: process.env.TEST_DB_NAME,
      user:     process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      port: process.env.TEST_DB_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: CLEARDB_DATABASE_URL.pathname.substring(1),
      user:  CLEARDB_DATABASE_URL.username,
      password: CLEARDB_DATABASE_URL.password,
      host: CLEARDB_DATABASE_URL.host,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
