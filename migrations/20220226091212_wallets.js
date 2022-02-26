/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("wallets", function (table) {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.string("wallet_code").notNullable();
    table.string("wallet_pin").defaultTo(null);
    table.decimal("balance", 12, 2).defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("wallets");
};
