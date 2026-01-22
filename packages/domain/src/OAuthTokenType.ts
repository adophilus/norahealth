import { Schema } from 'effect'

export const OAuthTokenType = Schema.Literal(
  'USER_TOKEN',
  'PAGE_TOKEN',
  'APP_TOKEN'
)

export type OAuthTokenType = typeof OAuthTokenType.Type
