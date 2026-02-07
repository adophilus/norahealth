import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('workout_sessions')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('workout_id', 'text', (col) => col.notNull())
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('completed_at', 'integer')
    .addColumn('soreness_level', 'text')
    .addColumn('duration_minutes', 'integer')
    .addColumn('notes', 'text')
    .addColumn('created_at', 'integer', (col) =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addColumn('updated_at', 'integer')
    .addColumn('deleted_at', 'integer')
    .addForeignKeyConstraint(
      'workout_sessions_workout_id_fk',
      ['workout_id'],
      'workouts',
      ['id']
    )
    .execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('workout_sessions').execute()
}
