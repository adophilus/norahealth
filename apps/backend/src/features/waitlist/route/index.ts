import { HttpApiBuilder } from '@effect/platform'
import { AddWaitlistEntryEndpointLive } from './AddWaitlistEntryEndpoint'
import { Api } from '@nora-health/api'

export const WaitlistApiLive = HttpApiBuilder.group(
  Api,
  'Waitlist',
  (handlers) =>
    handlers.handle('addWaitlistEntry', AddWaitlistEntryEndpointLive)
)
