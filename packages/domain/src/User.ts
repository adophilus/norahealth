import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'
import Email from './Email'

const UserRole = Schema.Union(Schema.Literal('USER'), Schema.Literal('ADMIN'))

const UserProfileStatus = Schema.Literal('NOT_VERIFIED', 'VERIFIED', 'BANNED')

class User extends Schema.Class<User>('User')({
  id: Id,
  display_name: Schema.NullOr(Schema.String),
  email: Schema.NullOr(Email),
  status: UserProfileStatus,
  role: UserRole,
  profile_picture_id: Schema.NullOr(Id),
  verified_at: Schema.NullOr(Timestamp),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp),
  deleted_at: Schema.NullOr(Timestamp)
}) {}

export default User
