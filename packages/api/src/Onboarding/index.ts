import { HttpApiGroup } from '@effect/platform'
import CreateHealthProfileEndpoint from './CreateHealthProfileEndpoint'

const OnboardingApi = HttpApiGroup.make('Onboarding').add(
  CreateHealthProfileEndpoint
)

export default OnboardingApi
