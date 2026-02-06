import { Schema } from 'effect'
import { Id } from './Id'
import PostStatus from './PostStatus'

class Post extends Schema.Class<Post>('Post')({
  id: Id,
  content: Schema.String,
  media_ids: Schema.Array(Id),
  status: PostStatus,
  scheduled_at: Schema.NullOr(Schema.Number),
  published_at: Schema.NullOr(Schema.Number),
  user_id: Id,
  created_at: Schema.Number,
  updated_at: Schema.NullOr(Schema.Number)
}) {}

export default Post
