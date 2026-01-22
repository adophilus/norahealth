import { Schema } from 'effect'

class TokenNotExpiredError extends Schema.TaggedError<TokenNotExpiredError>()(
  'TokenNotExpiredError',
  { expires_at: Schema.Number }
) {}

export default TokenNotExpiredError
