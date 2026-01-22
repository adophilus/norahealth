import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('waitlist_entries')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('created_at', 'integer', (col) =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addColumn('updated_at', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('waitlist_entries').execute()
}
