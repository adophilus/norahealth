import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('email', 'text')
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('profile_picture_id', 'text')
    .addColumn('verified_at', 'integer')
    .addColumn('created_at', 'integer', (col) =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addColumn('updated_at', 'integer')
    .addColumn('deleted_at', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
}
