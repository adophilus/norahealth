import { HttpApiEndpoint } from '@effect/platform'
import { Schema } from 'effect'
import { UnexpectedError, UnauthorizedError, UserWithProfile } from '../common'
import { StatusCodes } from 'http-status-codes'

export class GetProfileSuccessResponse extends Schema.TaggedClass<GetProfileSuccessResponse>()(
  'GetProfileResponse',
  {
    data: UserWithProfile
  }
) {}

const GetProfileEndpoint = HttpApiEndpoint.get('getProfile', '/users/profile')
  .addSuccess(GetProfileSuccessResponse)
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })

export default GetProfileEndpoint
