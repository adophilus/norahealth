import { Schema } from 'effect'

export class EnvSchema extends Schema.Class<EnvSchema>('EnvSchema')({
  NODE_ENV: Schema.Literal('production', 'staging', 'development', 'test'),
  AUTH_TOKEN_SECRET: Schema.String,
  DATABASE_URL: Schema.String,
  DATABASE_PREFIX: Schema.NullOr(Schema.String),
  DATABASE_MIGRATIONS_FOLDER: Schema.String,
  MAIL_URL: Schema.String,
  MAIL_SENDER_NAME: Schema.String,
  MAIL_SENDER_EMAIL: Schema.String,
  MAIL_SUPPORT_NAME: Schema.String,
  MAIL_SUPPORT_EMAIL: Schema.String,
  SERVER_PORT: Schema.Number,
  SERVER_URL: Schema.String,
  FACEBOOK_APP_ID: Schema.String,
  FACEBOOK_APP_SECRET: Schema.String,
  NEYNAR_API_KEY: Schema.String,
  NEYNAR_SEED_PHRASE: Schema.String
}) {}
