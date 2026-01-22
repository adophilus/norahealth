import { Context } from 'effect'
import type { EnvSchema } from './schema'

// Define the service tag for accessing validated environment variables
export class Env extends Context.Tag('Env')<Env, EnvSchema>() {}
