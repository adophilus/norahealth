import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('is_verified', 'integer', (col) => col.defaultTo(0))
    .addColumn('resolution_class', 'text')
    .addColumn('dietary_exclusions', 'text')
    .addColumn('physical_constraints', 'text')
    .addColumn('medical_redlines', 'text')
    .addColumn('fitness_goals', 'text')
    .addColumn('fitness_level', 'text')
    .addColumn('created_at', 'bigint', (col) => col.notNull())
    .addColumn('updated_at', 'bigint', (col) => col.defaultTo(null))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').ifExists().execute()
}
