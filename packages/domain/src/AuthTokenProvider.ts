import { Schema } from 'effect'

const DefaultProvider = Schema.Struct({
  id: Schema.Literal('default'),
  code: Schema.String
})

const EmailProvider = Schema.Struct({
  id: Schema.Literal('email'),
  code: Schema.String
})

export const AuthTokenProvider = Schema.Union(EmailProvider, DefaultProvider)

export type AuthTokenProvider = typeof AuthTokenProvider.Type
