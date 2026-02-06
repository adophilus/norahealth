import { Schema } from 'effect'
import { Id } from './Id'
import PostStatus from './PostStatus'
import { PlatformName } from './PlatformName'

class PostPlatform extends Schema.Class<PostPlatform>('PostPlatform')({
  id: Id,
  post_id: Id,
  platform: PlatformName,
  status: PostStatus,
  published_at: Schema.NullOr(Schema.Number),
  created_at: Schema.Number,
  updated_at: Schema.NullOr(Schema.Number)
}) {}

export default PostPlatform
