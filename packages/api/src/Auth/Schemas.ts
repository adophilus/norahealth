import { Schema } from 'effect'
import { User } from '@nora-health/domain'
import { SessionToken } from '../common'

export class VerifyAuthSuccessResponse extends Schema.TaggedClass<VerifyAuthSuccessResponse>()(
  'VerifyAuthSuccessResponse',
  {
    user: User,
    access_token: SessionToken
  }
) {}
