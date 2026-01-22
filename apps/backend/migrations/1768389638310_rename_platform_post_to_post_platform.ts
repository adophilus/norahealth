import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('platform_post')
    .renameTo('post_platform')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('post_platform')
    .renameTo('platform_post')
    .execute()
}
