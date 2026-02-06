import { Schema } from 'effect'
import { HealthProfile } from './HealthProfile'
import User from './User'
import MediaDescription from './MediaDescription'

export default class FullUser extends Schema.Class<FullUser>('FullUser')({
  ...User.fields,
  profile_picture: Schema.NullOr(MediaDescription),
  health_profile: HealthProfile
}) {}
