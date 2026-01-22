import { createMockUserSignUpDetails } from './generator'
import { Effect } from 'effect'
import { UserRepository } from '@/features/user'
import { ulid } from 'ulidx'
import { AuthSessionService } from '@/features/auth'

export const mockUserWithSession = Effect.gen(function* () {
  const authUserRepo = yield* UserRepository
  const authSessionService = yield* AuthSessionService
  const userDetails = createMockUserSignUpDetails()

  const user = yield* authUserRepo.create({
    ...userDetails,
    id: ulid(),
    has_creator_profile: false,
    role: 'USER'
  })

  const session = yield* authSessionService.create(user.id)

  return { user, session }
})
