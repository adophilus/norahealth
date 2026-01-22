import { Schema } from 'effect'

export class PlatformPublishError extends Schema.TaggedClass<PlatformPublishError>()(
  'PlatformPublishError',
  {
    provider: Schema.String,
    code: Schema.String,
    message: Schema.String,
    details: Schema.NullOr(
      Schema.Record({ key: Schema.String, value: Schema.Unknown })
    ),
    retryable: Schema.Boolean
  }
) {}

export class PlatformRateLimitError extends Schema.TaggedClass<PlatformRateLimitError>()(
  'PlatformRateLimitError',
  {
    provider: Schema.String,
    message: Schema.String,
    retryAfter: Schema.Number
  }
) {}

export class PlatformPermissionDeniedError extends Schema.TaggedClass<PlatformPermissionDeniedError>()(
  'PlatformPermissionDeniedError',
  {
    provider: Schema.String,
    requiredPermissions: Schema.Array(Schema.String)
  }
) {}

export class PlatformContentValidationError extends Schema.TaggedClass<PlatformContentValidationError>()(
  'PlatformContentValidationError',
  {
    provider: Schema.String,
    field: Schema.String,
    message: Schema.String
  }
) {}
