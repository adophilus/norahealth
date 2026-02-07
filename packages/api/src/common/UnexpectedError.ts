import { Schema } from 'effect'

class UnexpectedError extends Schema.TaggedError<UnexpectedError>()(
  'UnexpectedError',
  {
    message: Schema.String
  }
) {}

export default UnexpectedError
