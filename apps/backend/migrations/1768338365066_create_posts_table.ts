import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('posts')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('media_ids', 'text', (col) => col.defaultTo('[]').notNull())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('scheduled_at', 'integer')
    .addColumn('published_at', 'integer')
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('created_at', 'integer', (col) =>
      col.notNull().defaultTo(sql`(UNIXEPOCH())`)
    )
    .addColumn('updated_at', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('posts').execute()
}
