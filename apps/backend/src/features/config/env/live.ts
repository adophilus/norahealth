import { Config, Effect, Layer, Option, Schema } from 'effect'
import { Env } from './interface'
import { EnvSchema } from './schema'

export const EnvLive = Layer.effect(
  Env,
  Effect.gen(function* () {
    const rawConfig = {
      NODE_ENV: yield* Config.string('NODE_ENV'),
      AUTH_TOKEN_SECRET: yield* Config.string('AUTH_TOKEN_SECRET'),
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
      FACEBOOK_APP_ID: yield* Config.string('FACEBOOK_APP_ID'),
      FACEBOOK_APP_SECRET: yield* Config.string('FACEBOOK_APP_SECRET'),
      NEYNAR_API_KEY: yield* Config.string('NEYNAR_API_KEY'),
      NEYNAR_SEED_PHRASE: yield* Config.string('NEYNAR_SEED_PHRASE')
    }

    const decoder = Schema.decodeUnknown(EnvSchema)
    const validatedEnv = yield* decoder(rawConfig)
    return validatedEnv
  })
)
