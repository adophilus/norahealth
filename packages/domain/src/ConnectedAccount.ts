import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'
import { PlatformName } from './PlatformName'

class ConnectedAccount extends Schema.Class<ConnectedAccount>(
  'ConnectedAccount'
)({
  id: Id,
  user_id: Id,
  platform: PlatformName,
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
  disconnected_at: Schema.NullOr(Timestamp)
}) {}

export default ConnectedAccount
