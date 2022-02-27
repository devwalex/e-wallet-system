/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("transactions", function (table) {
        table.increments("id").primary();
        table.integer("user_id").notNullable();
        table.string("transaction_code").notNullable();
        table.string("transaction_reference").notNullable();
        table.decimal("amount", 12, 2).notNullable();
        table.string("description").notNullable();
        table.string("status", 80).notNullable();
        table.string("payment_method").notNullable();
        table.boolean("is_inflow").defaultTo(null);
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("transactions");
  
};
