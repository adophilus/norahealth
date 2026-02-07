import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('health_profiles')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('age_group', 'text', (col) => col.notNull())
    .addColumn('gender', 'text', (col) => col.notNull())
    .addColumn('weight_class', 'text', (col) => col.notNull())
    .addColumn('injuries', 'text', (col) => col.notNull()) // JSON string
    .addColumn('medical_conditions', 'text', (col) => col.notNull()) // JSON string
    .addColumn('fitness_goals', 'text', (col) => col.notNull()) // JSON string
    .addColumn('weekly_workout_time', 'integer', (col) => col.notNull())
    .addColumn('allergies', 'text', (col) => col.notNull()) // JSON string
    .addColumn('location', 'text', (col) => col.notNull()) // JSON string
    .addColumn('onboarding_completed', 'integer', (col) => col.defaultTo(0))
    .addColumn('onboarding_completed_at', 'integer')
    .addColumn('created_at', 'integer', (col) =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addColumn('updated_at', 'integer', (col) => col.defaultTo(null))
    .addForeignKeyConstraint(
      'health_profiles_user_id_fk',
      ['user_id'],
      'users',
      ['id'],
      (fk) => fk.onDelete('cascade')
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('health_profiles').ifExists().execute()
}
