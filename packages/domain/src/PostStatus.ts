import { Schema } from 'effect'

const PostStatus = Schema.Literal(
  'DRAFT',
  'SCHEDULED',
  'PUBLISHED',
  'FAILED'
)

export default PostStatus
