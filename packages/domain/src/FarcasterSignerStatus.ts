import { Schema } from 'effect'

export const NeynarSignerStatus = Schema.Union(
  Schema.Literal('PENDING_APPROVAL'),
  Schema.Literal('ACTIVE'),
  Schema.Literal('REVOKED')
)

export type NeynarSignerStatus = typeof NeynarSignerStatus.Type
