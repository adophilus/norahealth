import { Schema } from 'effect'

export class SeederConfig extends Schema.TaggedClass<SeederConfig>(
  'SeederConfig'
)('SeederConfig', {
  dryRun: Schema.Boolean,
  batchSize: Schema.Number,
  clearExisting: Schema.Boolean
}) {}

export class SeederError extends Schema.Class<SeederError>('SeederError')({
  message: Schema.String,
  cause: Schema.Unknown
}) {}
