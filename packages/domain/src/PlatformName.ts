import { Schema } from 'effect'

export const PlatformName = Schema.Literal(
  'TWITTER',
  'FACEBOOK',
  'INSTAGRAM',
  'FARCASTER',
  'BASEAPP',
  'ZORA'
)

export type PlatformName = typeof PlatformName.Type
