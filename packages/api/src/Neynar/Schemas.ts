import { Schema } from 'effect'
import { Id } from '@nora-health/domain'

export class SignerApprovalRequiredResponse extends Schema.TaggedClass<SignerApprovalRequiredResponse>()(
  'SignerApprovalRequiredResponse',
  {
    id: Id,
    url: Schema.String
  }
) {}
