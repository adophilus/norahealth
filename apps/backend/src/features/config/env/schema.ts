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
  LLM_PROVIDER: Schema.Literal('gemini', 'glm'),
  GEMINI_API_KEY: Schema.String,
  GLM_API_KEY: Schema.String,
  OPENWEATHER_API_KEY: Schema.String,
  GOOGLE_MAPS_API_KEY: Schema.String,
  FIREBASE_PROJECT_ID: Schema.String,
  FIREBASE_PRIVATE_KEY: Schema.String,
  FIREBASE_CLIENT_EMAIL: Schema.String
}) {}
