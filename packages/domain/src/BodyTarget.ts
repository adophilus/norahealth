import { Schema } from 'effect'

export const BodyTarget = Schema.Literal(
  'FULL_BODY',
  'UPPER_BODY',
  'LOWER_BODY',
  'CORE',
  'BACK',
  'CHEST',
  'SHOULDERS',
  'ARMS',
  'LEGS',
  'CARDIO'
)

export type BodyTarget = typeof BodyTarget.Type
