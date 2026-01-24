import { Schema } from 'effect'

// Auth Config Schema
export const AuthConfigSchema = Schema.Struct({
  token: Schema.Struct({
    secret: Schema.String,
    access: Schema.Struct({
      expiry: Schema.Number
    }),
    refresh: Schema.Struct({
      expiry: Schema.Number
    }),
    signup: Schema.Struct({
      expiry: Schema.Number
    }),
    signin: Schema.Struct({
      expiry: Schema.Number
    })
  })
})

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
  provider: Schema.Literal('gemini', 'glm'),
  gemini: Schema.Struct({
    apiKey: Schema.String,
    model: Schema.String
  }),
  glm: Schema.Struct({
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
  }),
  firebase: Schema.Struct({
    projectId: Schema.String,
    privateKey: Schema.String,
    clientEmail: Schema.String
  })
})

export class AppConfigSchema extends Schema.Class<AppConfigSchema>(
  'AppConfigSchema'
)({
  auth: AuthConfigSchema,
  db: DatabaseConfigSchema,
  environment: EnvironmentConfigSchema,
  mail: MailConfigSchema,
  server: ServerConfigSchema,
  llm: LLMConfigSchema,
  externalApis: ExternalApiConfigSchema
}) {}
