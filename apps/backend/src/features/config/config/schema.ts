import { Schema } from 'effect'

// Database Config Schema
export const DatabaseConfigSchema = Schema.Struct({
  url: Schema.String,
  prefix: Schema.NullOr(Schema.String),
  migrationsFolder: Schema.String
})

// Environment Config Schema
export const EnvironmentConfigSchema = Schema.Struct({
  isProduction: Schema.Boolean,
  isStaging: Schema.Boolean,
  isDevelopment: Schema.Boolean,
  isTesting: Schema.Boolean
})

// Mail Config Schema
export const MailConfigSchema = Schema.Struct({
  url: Schema.String,
  sender: Schema.Struct({
    name: Schema.String,
    email: Schema.String
  }),
  support: Schema.Struct({
    name: Schema.String,
    email: Schema.String
  })
})

export const ServerConfigSchema = Schema.Struct({
  port: Schema.Number,
  url: Schema.String
})

// LLM Config Schema
export const LLMConfigSchema = Schema.Struct({
  provider: Schema.Literal('gemini', 'zai'),
  gemini: Schema.Struct({
    apiKey: Schema.String,
    model: Schema.String
  }),
  zai: Schema.Struct({
    apiKey: Schema.String,
    model: Schema.String
  })
})

// External API Config Schema
export const ExternalApiConfigSchema = Schema.Struct({
  openWeather: Schema.Struct({
    apiKey: Schema.String
  }),
  googleMaps: Schema.Struct({
    apiKey: Schema.String
  })
})

// Vapid Config Schema
export const VapidConfigSchema = Schema.Struct({
  publicKey: Schema.String,
  privateKey: Schema.String
})

export class AppConfigSchema extends Schema.Class<AppConfigSchema>(
  'AppConfigSchema'
)({
  db: DatabaseConfigSchema,
  environment: EnvironmentConfigSchema,
  mail: MailConfigSchema,
  server: ServerConfigSchema,
  llm: LLMConfigSchema,
  externalApis: ExternalApiConfigSchema,
  vapid: VapidConfigSchema
}) {}
