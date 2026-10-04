/** Knex migration exports.up / exports.down for orders table. */
/** @param {import('knex').Knex} knex */
export async function up(knex) {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.decimal("total", 14, 2).notNullable();
    table.string("status").notNullable().defaultTo("pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/** @param {import('knex').Knex} knex */
export async function down(knex) {
  await knex.schema.dropTableIfExists("orders");
}
