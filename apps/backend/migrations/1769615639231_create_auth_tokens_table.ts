import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('display_name', 'text')
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('status', 'text', (col) => col.defaultTo('NOT_VERIFIED'))
    .addColumn('role', 'text', (col) => col.defaultTo('USER'))
    .addColumn('profile_picture_id', 'text')
    .addColumn('verified_at', 'bigint')
    .addColumn('created_at', 'bigint', (col) =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addColumn('updated_at', 'bigint', (col) => col.defaultTo(null))
    .addColumn('deleted_at', 'bigint', (col) => col.defaultTo(null))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').ifExists().execute()
}
