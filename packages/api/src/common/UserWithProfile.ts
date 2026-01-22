import { Schema } from 'effect'
import { User, MediaDescription } from '@nora-health/domain'

class UserWithProfile extends Schema.Class<UserWithProfile>('UserWithProfile')(
  Schema.Struct({
    ...User.fields,
    profile_picture: Schema.NullOr(MediaDescription)
  })
) {}

export default UserWithProfile
