import { type Context, Effect, Layer } from 'effect'
import { Mailer } from './interface'

type SentEmail = {
  recipients: string[]
  subject: string
  email: JSX.Element
}

const sentEmails: SentEmail[] = []

export const MockMailer: Context.Tag.Service<Mailer> = {
  send: (payload) =>
    Effect.sync(() => {
      // For a mock, we just store the email in memory
      sentEmails.push(payload)
      // console.log(`MockMailer: Sent email to ${payload.recipients.join(', ')} with subject: ${payload.subject}`)
    })
}

export const MockMailerLive = Layer.succeed(Mailer, MockMailer)

