import type { Kysely } from 'kysely'

export const up = async (db: Kysely<any>) => {
  await db.schema.dropIndex('idx_farcaster_signers_user_id').execute()
  await db.schema.dropIndex('idx_farcaster_signers_fid').execute()
  await db.schema.dropIndex('idx_farcaster_signers_signer_uuid').execute()

  await db.schema
    .alterTable('farcaster_signers')
    .renameTo('neynar_signers')
    .execute()

  await db.schema
    .createIndex('idx_neynar_signers_user_id')
    .on('neynar_signers')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_neynar_signers_fid')
    .on('neynar_signers')
    .column('fid')
    .execute()

  await db.schema
    .createIndex('idx_neynar_signers_signer_uuid')
    .on('neynar_signers')
    .column('signer_uuid')
    .execute()
}

export const down = async (db: Kysely<any>) => {
  await db.schema.dropIndex('idx_neynar_signers_user_id').execute()
  await db.schema.dropIndex('idx_neynar_signers_fid').execute()
  await db.schema.dropIndex('idx_neynar_signers_signer_uuid').execute()

  await db.schema
    .alterTable('neynar_signers')
    .renameTo('farcaster_signers')
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
