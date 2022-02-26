/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id').primary()
        table.string('first_name').notNullable()
        table.string('last_name').notNullable()
        table.string('email').unique().notNullable()
        table.string('password').notNullable()
        table.timestamps(true, true)
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
