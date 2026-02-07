import { Effect, Layer, Schema } from 'effect'
import { Env } from '../env'
import { AppConfig } from './interface'
import { AppConfigSchema } from './schema'

export const AppConfigLive = Layer.effect(
  AppConfig,
  Effect.gen(function* () {
    const env = yield* Env

    const config = {
      db: {
        url: env.DATABASE_URL,
        prefix: env.DATABASE_PREFIX,
        migrationsFolder: env.DATABASE_MIGRATIONS_FOLDER
      },
      environment: {
        isProduction: env.NODE_ENV === 'production',
        isStaging: env.NODE_ENV === 'staging',
        isDevelopment: env.NODE_ENV === 'development',
        isTesting: env.NODE_ENV === 'test'
      },
      mail: {
        url: env.MAIL_URL,
        sender: {
          name: env.MAIL_SENDER_NAME,
          email: env.MAIL_SENDER_EMAIL
        },
        support: {
          name: env.MAIL_SUPPORT_NAME,
          email: env.MAIL_SUPPORT_EMAIL
        }
      },
      server: {
        port: env.SERVER_PORT,
        url: env.SERVER_URL
      },
      llm: {
        provider: env.LLM_PROVIDER,
        gemini: {
          apiKey: env.GEMINI_API_KEY,
          model: 'gemini-2.5-flash-vision'
        },
        zai: {
          apiKey: env.ZHIPU_API_KEY,
          model: 'glm-4-flash'
        }
      },
      externalApis: {
        openWeather: {
          apiKey: env.OPENWEATHER_API_KEY
        },
        googleMaps: {
          apiKey: env.GOOGLE_MAPS_API_KEY
        }
      },
      vapid: {
        publicKey: env.VAPID_PUBLIC_KEY,
        privateKey: env.VAPID_PRIVATE_KEY
      }
    }

    return yield* Schema.decodeUnknown(AppConfigSchema)(config)
  })
)
