import { Schema } from 'effect'

class UnexpectedError extends Schema.TaggedError<UnexpectedError>()(
  'UnexpectedError',
  {
    message: Schema.String.pipe(
      Schema.optionalWith({
        default: () => 'Sorry an error occurred'
      })
    )
  }
) {}

export default UnexpectedError
