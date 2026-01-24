import { Schema } from 'effect'
import Id from './Id'
import Timestamp from './Timestamp'

export const ResolutionClass = Schema.Literal(
  'PERFORMANCE',
  'VITALITY',
  'LONGEVITY'
)

export default class HealthProfile extends Schema.Class<HealthProfile>(
  'HealthProfile'
)({
  id: Id,
  user_id: Id,
  resolution_class: ResolutionClass,
  dietary_exclusions: Schema.Array(Schema.String),
  physical_constraints: Schema.Array(Schema.String),
  medical_redlines: Schema.Array(Schema.String),
  fitness_goals: Schema.Array(Schema.String),
  fitness_level: Schema.Literal('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}
