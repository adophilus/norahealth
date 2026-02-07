import { Effect, Layer } from 'effect'
import { Mailer } from './interface'

export const MockMailerLive = Layer.succeed(Mailer, {
  send: () => Effect.void
})
