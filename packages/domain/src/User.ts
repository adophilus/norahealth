import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'
import Email from './Email'
import { UserProfileStatus } from './UserProfileStatus'
import { UserRole } from './UserRole'

class User extends Schema.Class<User>('User')({
  id: Id,
  display_name: Schema.NullOr(Schema.String),
  email: Email,
  status: UserProfileStatus,
  role: UserRole,
  profile_picture_id: Schema.NullOr(Id),
  verified_at: Schema.NullOr(Timestamp),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp),
  deleted_at: Schema.NullOr(Timestamp)
}) {}

export default User
