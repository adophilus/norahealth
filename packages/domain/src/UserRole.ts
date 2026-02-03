import { Schema } from 'effect'

export const UserRole = Schema.Union(
  Schema.Literal('USER'),
  Schema.Literal('ADMIN')
)

export type UserRole = typeof UserRole.Type
