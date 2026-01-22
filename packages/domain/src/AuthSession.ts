import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'

class AuthSession extends Schema.Class<AuthSession>('AuthSession')({
  id: Id,
  user_id: Id,
  expires_at: Timestamp,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}

export default AuthSession
