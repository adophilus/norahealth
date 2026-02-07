import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('meals')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('food_classes', 'text', (col) => col.notNull().defaultTo('[]'))
    .addColumn('calories', 'real')
    .addColumn('protein', 'real')
    .addColumn('carbs', 'real')
    .addColumn('fat', 'real')
    .addColumn('prep_time_minutes', 'integer')
    .addColumn('cover_image_id', 'text', (col) =>
      col.references('storage_files.id').onDelete('set null')
    )
    .addColumn('allergens', 'text', (col) => col.notNull().defaultTo('[]'))
    .addColumn('is_prepackaged', 'boolean', (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn('fitness_goals', 'text', (col) => col.notNull().defaultTo('[]'))
    .addColumn('created_at', 'integer', (col) =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addColumn('updated_at', 'integer')
    .addColumn('deleted_at', 'integer')
    .execute()

  await db.schema
    .createIndex('idx_meals_fitness_goals')
    .on('meals')
    .column('fitness_goals')
    .execute()

  await db.schema
    .createIndex('idx_meals_allergens')
    .on('meals')
    .column('allergens')
    .execute()

  await db.schema
    .createIndex('idx_meals_food_classes')
    .on('meals')
    .column('food_classes')
    .execute()

  await db.schema
    .createIndex('idx_meals_deleted')
    .on('meals')
    .column('deleted_at')
    .where('deleted_at', 'is not', null)
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('meals').execute()
}
