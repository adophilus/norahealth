import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('daily_workout_plans')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('date', 'text', (col) => col.notNull())
    .addColumn('morning_workout_id', 'text')
    .addColumn('afternoon_workout_id', 'text')
    .addColumn('evening_workout_id', 'text')
    .addColumn('notes', 'text')
    .addColumn('created_at', 'integer', (col) =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addColumn('updated_at', 'integer')
    .addColumn('deleted_at', 'integer')
    .addForeignKeyConstraint(
      'daily_workout_plans_morning_workout_id_fk',
      ['morning_workout_id'],
      'workouts',
      ['id']
    )
    .addForeignKeyConstraint(
      'daily_workout_plans_afternoon_workout_id_fk',
      ['afternoon_workout_id'],
      'workouts',
      ['id']
    )
    .addForeignKeyConstraint(
      'daily_workout_plans_evening_workout_id_fk',
      ['evening_workout_id'],
      'workouts',
      ['id']
    )
    .execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('daily_workout_plans').execute()
}
