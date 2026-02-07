import { HttpApiEndpoint } from '@effect/platform'
import { FullUser } from '@nora-health/domain'
import { StatusCodes } from 'http-status-codes'
import { UnauthorizedError, UnexpectedError } from '../common'

const GetProfileEndpoint = HttpApiEndpoint.get('getProfile', '/users/profile')
  .addSuccess(FullUser)
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })

export default GetProfileEndpoint
