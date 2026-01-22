import { type Kysely, sql } from 'kysely'

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable('farcaster_signers')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) =>
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('signer_uuid', 'text', (col) => col.notNull().unique())
    .addColumn('fid', 'text', (col) => col.notNull())
    .addColumn('public_key', 'text', (col) => col.notNull())
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .check(sql`status IN ('PENDING_APPROVAL', 'ACTIVE', 'REVOKED')`)
    )
    .addColumn('created_at', 'integer', (col) =>
      col.notNull().defaultTo(sql`(UNIXEPOCH())`)
    )
    .addColumn('updated_at', 'integer')
    .addColumn('deleted_at', 'integer', (col) => col.defaultTo(null))
    .execute()

  await db.schema
    .createIndex('idx_farcaster_signers_user_id')
    .on('farcaster_signers')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_farcaster_signers_fid')
    .on('farcaster_signers')
    .column('fid')
    .execute()

  await db.schema
    .createIndex('idx_farcaster_signers_signer_uuid')
    .on('farcaster_signers')
    .column('signer_uuid')
    .execute()
}

export const down = async (db: Kysely<any>) => {
  await db.schema.dropIndex('idx_farcaster_signers_user_id').execute()
  await db.schema.dropIndex('idx_farcaster_signers_fid').execute()
  await db.schema.dropIndex('idx_farcaster_signers_signer_uuid').execute()
  await db.schema.dropTable('farcaster_signers').execute()
}
