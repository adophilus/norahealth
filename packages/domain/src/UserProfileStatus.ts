import { Schema } from 'effect'

export const UserProfileStatus = Schema.Literal(
  'NOT_VERIFIED',
  'ONBOARDING_REQUIRED',
  'ONBOARDING_COMPLETE'
)

export type UserProfileStatus = typeof UserProfileStatus.Type
