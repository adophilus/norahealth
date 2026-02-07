import { Schema } from 'effect'

export const UserRole = Schema.Literal('USER', 'ADMIN')

export type UserRole = typeof UserRole.Type
