import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'
import { OAuthProvider } from './OAuthProvider'
import { OAuthTokenType } from './OAuthTokenType'

class OAuthToken extends Schema.Class<OAuthToken>('OAuthToken')({
  id: Id,
  connected_account_id: Id,
  provider: OAuthProvider,
  token_type: OAuthTokenType,
  platform_account_id: Schema.NullOr(Schema.String),
  access_token: Schema.String,
  refresh_token: Schema.NullOr(Schema.String),
  expires_at: Schema.NullOr(Timestamp),
  scopes: Schema.Array(Schema.String),
  is_active: Schema.Boolean,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp),
  last_used_at: Schema.NullOr(Timestamp),
  revoked_at: Schema.NullOr(Timestamp)
}) {}

export default OAuthToken
