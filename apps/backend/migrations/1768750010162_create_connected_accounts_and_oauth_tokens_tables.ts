import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('connected_accounts')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('platform', 'text', (col) => col.notNull())
    .addColumn('platform_account_id', 'text', (col) => col.notNull())
    .addColumn('platform_username', 'text', (col) => col.notNull())
    .addColumn('platform_display_name', 'text')
    .addColumn('profile_url', 'text')
    .addColumn('avatar_url', 'text')
    .addColumn('is_active', 'boolean')
    .addColumn('is_primary', 'boolean')
    .addColumn('last_connected_at', 'integer')
    .addColumn('disconnected_at', 'integer')
    .addColumn('created_at', 'integer', (col) =>
      col.notNull().defaultTo(sql`(UNIXEPOCH())`)
    )
    .addColumn('updated_at', 'integer')
    .execute()

  await db.schema
    .createTable('oauth_tokens')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('connected_account_id', 'text', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('token_type', 'text', (col) => col.notNull())
    .addColumn('platform_account_id', 'text')
    .addColumn('access_token', 'text', (col) => col.notNull())
    .addColumn('refresh_token', 'text')
    .addColumn('expires_at', 'integer')
    .addColumn('scopes', 'text', (col) => col.notNull())
    .addColumn('is_active', 'boolean', (col) => col.notNull())
    .addColumn('created_at', 'integer', (col) =>
      col.notNull().defaultTo(sql`(UNIXEPOCH())`)
    )
    .addColumn('updated_at', 'integer')
    .addColumn('last_used_at', 'integer')
    .addColumn('revoked_at', 'integer')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('connected_accounts').execute()
  await db.schema.dropTable('oauth_tokens').execute()
}
