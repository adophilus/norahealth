import { Schema } from 'effect'
import { Timestamp } from '@nora-health/domain'

class VerificationOtpAlreadySentError extends Schema.TaggedError<VerificationOtpAlreadySentError>()(
  'VerificationOtpAlreadySentError',
  {
    expires_at: Timestamp
  }
) {}

export default VerificationOtpAlreadySentError
