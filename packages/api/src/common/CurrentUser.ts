import type { User } from '@nora-health/domain'
import { Context } from 'effect'

class CurrentUser extends Context.Tag('CurrentUser')<CurrentUser, User>() {}

export default CurrentUser
