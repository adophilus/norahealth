import { HttpApiGroup } from '@effect/platform'
import AddWaitlistEntryEndpoint from './AddWaitlistEntryEndpoint'

const WaitlistApi = HttpApiGroup.make('Waitlist').add(AddWaitlistEntryEndpoint)

export default WaitlistApi
