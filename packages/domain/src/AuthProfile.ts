import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'
import { AuthProfileMeta } from './AuthProfileMeta'

class AuthProfile extends Schema.Class<AuthProfile>('AuthProfile')({
  id: Id,
  meta: AuthProfileMeta,
  user_id: Id,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}

export default AuthProfile
