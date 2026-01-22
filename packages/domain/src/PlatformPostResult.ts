import { Schema } from 'effect'
import Timestamp from './Timestamp'

class PlatformPostResult extends Schema.Class<PlatformPostResult>(
  'PlatformPostResult'
)({
  platform_post_id: Schema.String,
  platform_post_url: Schema.NullOr(Schema.String),
  published_at: Timestamp
}) {}

export default PlatformPostResult
