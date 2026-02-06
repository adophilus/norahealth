import { Schema } from 'effect'
import { Id } from './Id'
import Timestamp from './Timestamp'

export const MetricType = Schema.Literal(
  'WEIGHT',
  'COMPLETION_RATE',
  'STREAK',
  'CALORIES_BURNED',
  'CALORIES_CONSUMED'
)

export default class ProgressMetric extends Schema.Class<ProgressMetric>(
  'ProgressMetric'
)({
  id: Id,
  user_id: Id,
  type: MetricType,
  value: Schema.String,
  date: Timestamp,
  created_at: Timestamp
}) {}
