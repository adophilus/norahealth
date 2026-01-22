import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'
import { OAuthProvider } from './OAuthProvider'
import OAuthToken from './OAuthToken'

class ConnectedAccountWithTokens extends Schema.Class<ConnectedAccountWithTokens>(
  'ConnectedAccountWithTokens'
)({
  id: Id,
  user_id: Id,
  platform: OAuthProvider,
  platform_account_id: Schema.String,
  platform_username: Schema.String,
  platform_display_name: Schema.NullOr(Schema.String),
  profile_url: Schema.NullOr(Schema.String),
  avatar_url: Schema.NullOr(Schema.String),
  is_active: Schema.Boolean,
  is_primary: Schema.Boolean,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp),
  last_connected_at: Schema.NullOr(Timestamp),
  disconnected_at: Schema.NullOr(Timestamp),
  tokens: Schema.Array(OAuthToken)
}) {}

export default ConnectedAccountWithTokens
