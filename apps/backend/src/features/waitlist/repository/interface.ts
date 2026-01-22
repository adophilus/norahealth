import { Context, type Effect } from 'effect'
import type { WaitlistEntry } from '@/types'
import type { WaitlistRepositoryError } from './error'

export class WaitlistRepository extends Context.Tag('WaitlistRepository')<
  WaitlistRepository,
  {
    create(
      payload: WaitlistEntry.Insertable
    ): Effect.Effect<WaitlistEntry.Selectable, WaitlistRepositoryError>

    findByEmail(
      email: string
    ): Effect.Effect<WaitlistEntry.Selectable | null, WaitlistRepositoryError>
  }
>() {}
