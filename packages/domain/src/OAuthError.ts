import { Schema } from 'effect'

export class OAuthError extends Schema.TaggedClass<OAuthError>()('OAuthError', {
  provider: Schema.String,
  code: Schema.String,
  message: Schema.String,
  details: Schema.NullOr(
    Schema.Record({ key: Schema.String, value: Schema.Unknown })
  )
}) {}

export class OAuthTokenExpiredError extends Schema.TaggedClass<OAuthTokenExpiredError>()(
  'OAuthTokenExpiredError',
  {
    provider: Schema.String,
    message: Schema.String
  }
) {}

export class OAuthInsufficientScopeError extends Schema.TaggedClass<OAuthInsufficientScopeError>()(
  'OAuthInsufficientScopeError',
  {
    provider: Schema.String,
    requiredScopes: Schema.Array(Schema.String),
    grantedScopes: Schema.Array(Schema.String)
  }
) {}

export class OAuthInvalidTokenError extends Schema.TaggedClass<OAuthInvalidTokenError>()(
  'OAuthInvalidTokenError',
  {
    provider: Schema.String,
    message: Schema.String
  }
) {}
