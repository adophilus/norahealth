import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('platform_post')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('post_id', 'text', (col) =>
      col.references('posts.id').onDelete('cascade').notNull()
    )
    .addColumn('platform', 'text', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('published_at', 'integer')
    .addColumn('created_at', 'integer', (col) =>
      col.notNull().defaultTo(sql`(UNIXEPOCH())`)
    )
    .addColumn('updated_at', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('platform_post').execute()
}
