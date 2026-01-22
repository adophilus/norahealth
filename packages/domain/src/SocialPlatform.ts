import { Schema } from 'effect'
import { PlatformName } from './PlatformName'

class SocialPlatform extends Schema.Class<SocialPlatform>('SocialPlatform')({
  id: Schema.String,
  name: Schema.String,
  type: PlatformName,
  logo_url: Schema.String,
  auth_url: Schema.String,
  is_active: Schema.Boolean,
  max_characters: Schema.Number,
  supports_media: Schema.Boolean,
  max_media_count: Schema.Number,
  supports_scheduling: Schema.Boolean
}) {}

export default SocialPlatform
