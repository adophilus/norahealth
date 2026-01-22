import { Schema } from 'effect'

class NotFoundError extends Schema.TaggedError<NotFoundError>()(
  'NotFoundError',
  {
    message: Schema.optional(Schema.String)
  }
) { }

export default NotFoundError
