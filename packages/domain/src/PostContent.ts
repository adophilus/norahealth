import { Schema } from 'effect'
import Id from './Id'

class PostContent extends Schema.Class<PostContent>('PostContent')({
  message: Schema.String,
  media_ids: Schema.Array(Id),
  link: Schema.NullOr(Schema.String),
  hashtags: Schema.NullOr(Schema.Array(Schema.String)),
  mentions: Schema.NullOr(Schema.Array(Schema.String))
}) {}

export default PostContent
