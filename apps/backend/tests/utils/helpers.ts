import { createMockUserSignUpDetails } from './generator'
import { Effect } from 'effect'
import { UserService } from '@/features/user'
import { AuthSessionService } from '@/features/auth'

export const mockUserWithSession = Effect.gen(function* () {
  const userService = yield* UserService
  const authSessionService = yield* AuthSessionService
  const userDetails = createMockUserSignUpDetails()

  const user = yield* userService.create({
    ...userDetails,
    role: 'USER',
    status: 'ONBOARDING_COMPLETE'
  })

  const session = yield* authSessionService.create(user.id)

  return { user, session }
})
