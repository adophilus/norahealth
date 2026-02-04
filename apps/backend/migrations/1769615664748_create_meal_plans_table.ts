import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('daily_meal_plans')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) =>
      col.notNull().references('users(id)').onDelete('cascade')
    )
    .addColumn('date', 'text', (col) => col.notNull())
    .addColumn('breakfast', 'text', (col) =>
      col.references('meals(id)').onDelete('set null')
    )
    .addColumn('lunch', 'text', (col) =>
      col.references('meals(id)').onDelete('set null')
    )
    .addColumn('dinner', 'text', (col) =>
      col.references('meals(id)').onDelete('set null')
    )
    .addColumn('snacks', 'text', (col) => col.notNull().defaultTo('[]'))
    .addColumn('notes', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('created_at', 'integer', (col) => col.notNull())
    .addColumn('updated_at', 'integer')
    .addColumn('deleted_at', 'integer')
    .execute()

  await db.schema
    .createIndex('idx_daily_meal_plans_user_date')
    .on('daily_meal_plans')
    .columns(['user_id', 'date'])
    .execute()

  await db.schema
    .createIndex('idx_daily_meal_plans_date')
    .on('daily_meal_plans')
    .columns(['date'])
    .execute()

  await db.schema
    .createIndex('idx_daily_meal_plans_deleted')
    .on('daily_meal_plans')
    .column('deleted_at')
    .where('deleted_at', 'is not', null)
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('daily_meal_plans').execute()
}
