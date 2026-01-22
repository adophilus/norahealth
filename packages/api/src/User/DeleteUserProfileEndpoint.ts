import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { Message, UnexpectedError } from '../common'

// Delete user profile
const DeleteUserProfileEndpoint = HttpApiEndpoint.del(
  'deleteUserProfile',
  '/users/profile'
)
  .addSuccess(Message)
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })

export default DeleteUserProfileEndpoint
