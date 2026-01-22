import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('auth_profiles')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('meta', 'text', (col) => col.notNull())
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('created_at', 'integer', (col) =>
      col.notNull().defaultTo(sql`(UNIXEPOCH())`)
    )
    .addColumn('updated_at', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('auth_profiles').execute()
}
