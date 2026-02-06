import { Schema } from 'effect'

class OnboardingIncompleteError extends Schema.TaggedError<OnboardingIncompleteError>()(
  'OnboardingIncompleteError',
  {}
) {}

export default OnboardingIncompleteError
