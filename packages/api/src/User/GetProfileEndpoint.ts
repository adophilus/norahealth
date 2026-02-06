import { HttpApiEndpoint } from '@effect/platform'
import { UnexpectedError, UnauthorizedError, FullUser } from '../common'
import { StatusCodes } from 'http-status-codes'

const GetProfileEndpoint = HttpApiEndpoint.get('getProfile', '/users/profile')
  .addSuccess(FullUser)
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })

export default GetProfileEndpoint
