import { Schema } from 'effect'
import User from './User'
import MediaDescription from './MediaDescription'

class UserWithProfilePicture extends Schema.Class<UserWithProfilePicture>(
  'UserWithProfilePicture'
)(
  Schema.Struct({
    ...User.fields,
    profile_picture_id: Schema.Never,
    profile_picture: Schema.NullOr(MediaDescription)
  })
) {}

export default UserWithProfilePicture
