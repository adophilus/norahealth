import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('workouts')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('is_outdoor', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('exercises', 'text', (col) => col.notNull())
    .addColumn('difficulty_level', 'text', (col) => col.notNull())
    .addColumn('duration_minutes', 'integer')
    .addColumn('body_targets', 'text', (col) => col.notNull().defaultTo('[]'))
    .addColumn('contraindications', 'text', (col) =>
      col.notNull().defaultTo('[]')
    )
    .addColumn('fitness_goals', 'text', (col) => col.notNull().defaultTo('[]'))
    .addColumn('intensity', 'text', (col) => col.notNull())
    .addColumn('created_at', 'integer', (col) =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addColumn('updated_at', 'integer')
    .addColumn('deleted_at', 'integer')
    .execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('workouts').execute()
}
