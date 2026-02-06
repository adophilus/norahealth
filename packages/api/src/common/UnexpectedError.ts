import { Schema } from 'effect'

class UnexpectedError extends Schema.TaggedError<UnexpectedError>()(
  'UnexpectedError',
  {
    message: Schema.optionalWith(Schema.String, {
      default: () => 'Sorry an error occurred'
    })
  }
) {}

export default UnexpectedError
