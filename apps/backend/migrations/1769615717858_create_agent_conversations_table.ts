import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('agent_conversations')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('agent_type', 'text', (col) => col.notNull())
    .addColumn('messages', 'text', (col) => col.notNull())
    .addColumn('context', 'text', (col) => col.defaultTo(null))
    .addColumn('created_at', 'bigint', (col) =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addColumn('updated_at', 'bigint', (col) => col.defaultTo(null))
    .addForeignKeyConstraint(
      'fk_agent_conversations_user_id',
      ['user_id'],
      'users',
      ['id']
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('agent_conversations').ifExists().execute()
}
