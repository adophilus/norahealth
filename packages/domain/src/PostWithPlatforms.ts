import { Schema } from 'effect'
import Post from './Post'
import PostPlatform from './PostPlatform'

export default class PostWithPlatforms extends Schema.Class<PostWithPlatforms>(
  'PostWithPlatforms'
)({
  ...Post.fields,
  platforms: Schema.Record({
    key: Schema.String,
    value: PostPlatform
  })
}) {}
