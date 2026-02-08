import { Config, Effect, Layer, Option, Schema } from 'effect'
import { Env } from './interface'
import { EnvSchema } from './schema'

export const EnvLive = Layer.effect(
  Env,
  Effect.gen(function* () {
    const rawConfig = {
      NODE_ENV: yield* Config.string('NODE_ENV'),
      DATABASE_URL: yield* Config.string('DATABASE_URL'),
      DATABASE_PREFIX: yield* Config.option(
        Config.string('DATABASE_PREFIX')
      ).pipe(Config.map(Option.getOrNull)),
      DATABASE_MIGRATIONS_FOLDER: yield* Config.string(
        'DATABASE_MIGRATIONS_FOLDER'
      ),
      MAIL_URL: yield* Config.string('MAIL_URL'),
      MAIL_SENDER_NAME: yield* Config.string('MAIL_SENDER_NAME'),
      MAIL_SENDER_EMAIL: yield* Config.string('MAIL_SENDER_EMAIL'),
      MAIL_SUPPORT_NAME: yield* Config.string('MAIL_SUPPORT_NAME'),
      MAIL_SUPPORT_EMAIL: yield* Config.string('MAIL_SUPPORT_EMAIL'),
      SERVER_PORT: yield* Config.number('SERVER_PORT'),
      SERVER_URL: yield* Config.string('SERVER_URL'),
      LLM_PROVIDER: yield* Config.string('LLM_PROVIDER'),
      GEMINI_API_KEY: yield* Config.string('GEMINI_API_KEY'),
      ZHIPU_API_KEY: yield* Config.string('ZHIPU_API_KEY'),
      OPENWEATHER_API_KEY: yield* Config.string('OPENWEATHER_API_KEY'),
      GOOGLE_MAPS_API_KEY: yield* Config.string('GOOGLE_MAPS_API_KEY'),
      VAPID_PUBLIC_KEY: yield* Config.string('VAPID_PUBLIC_KEY'),
      VAPID_PRIVATE_KEY: yield* Config.string('VAPID_PUBLIC_KEY'),
      OPIK_API_KEY: yield* Config.string('OPIK_API_KEY'),
      OPIK_API_URL: yield* Config.string('OPIK_API_URL'),
      OPIK_PROJECT_NAME: yield* Config.string('OPIK_PROJECT_NAME'),
      OPIK_WORKSPACE_NAME: yield* Config.string('OPIK_WORKSPACE_NAME')
    }

    const decoder = Schema.decodeUnknown(EnvSchema)
    const validatedEnv = yield* decoder(rawConfig)
    return validatedEnv
  })
)
