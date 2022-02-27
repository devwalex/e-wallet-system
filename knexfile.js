// Update with your config settings.

const Url = require('url-parse');
const CLEARDB_DATABASE_URL = new Url(process.env.CLEARDB_DATABASE_URL);

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'e_wallet_system',
      user:     'root',
      password: 'root',
      port: 8889
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
      database: 'e_wallet_system_test',
      user:     'root',
      password: 'root',
      port: 8889
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
