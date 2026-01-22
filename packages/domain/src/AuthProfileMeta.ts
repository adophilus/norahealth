import { Schema } from 'effect'
import Email from './Email'

class EmailMeta extends Schema.Class<EmailMeta>('EmailMeta')({
  key: Schema.Literal('EMAIL'),
  email: Email
}) {}

class FarcasterMeta extends Schema.Class<FarcasterMeta>('FarcasterMeta')({
  key: Schema.Literal('FARCASTER'),
  fid: Schema.String
}) {}

export const AuthProfileMeta = Schema.Union(EmailMeta, FarcasterMeta)
export type AuthProfileMeta = typeof AuthProfileMeta.Type
