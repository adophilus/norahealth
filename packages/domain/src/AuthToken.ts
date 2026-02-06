import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'
import { AuthTokenProvider } from './AuthTokenProvider'

class AuthToken extends Schema.Class<AuthToken>('AuthToken')({
  id: Id,
  expires_at: Schema.Number,
  hash: Schema.String.annotations({
    examples: [
      '7509e5bda0c762d2bac7f90d758b5b2263fa01ccbc542ab5e3df163be08e6ca9'
    ]
  }),
  provider: AuthTokenProvider,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}

export default AuthToken
