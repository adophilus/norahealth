import { Schema } from 'effect'

export const NeynarSignerStatus = Schema.Union(
  Schema.Literal('generated'),
  Schema.Literal('pending_approval'),
  Schema.Literal('approved'),
  Schema.Literal('revoked')
)

export type NeynarSignerStatus = typeof NeynarSignerStatus.Type
