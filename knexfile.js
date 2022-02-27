// Update with your config settings.

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
    // connection: {
    //   database: 'e_wallet_system',
    //   user:     'root',
    //   password: 'root',
    //   port: 8889
    // },
    connection: {
      connectionString: process.env.CLEARDB_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
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
