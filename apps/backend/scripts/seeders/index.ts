import { Command, Options } from '@effect/cli'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect, Layer } from 'effect'
import { seedMeals } from './meals-seeder'
import { SeederConfig } from './types'
import { DepLayer, LoggerLive } from '@/bootstrap'
import { AppConfigLive, EnvLive } from '@/features/config'

const cli = Command.make(
  'cli',
  {
    dryRun: Options.boolean('dry-run'),
    batchSize: Options.integer('batch-size'),
    clearExisting: Options.boolean('clear-existing')
  },
  (options) =>
    Effect.gen(function* () {
      const config = SeederConfig.make(options)

      yield* Effect.logDebug('🌱 Starting meal database seeding...')

      yield* seedMeals(config)

      yield* Effect.logDebug('✅ Meal database seeding completed successfully!')
    })
)

const app = Command.run(cli, {
  name: 'seeder',
  version: '0.0.1'
})

const layer = DepLayer.pipe(
  Layer.provide(LoggerLive),
  Layer.provide(AppConfigLive),
  Layer.provide(EnvLive),
  Layer.provideMerge(NodeContext.layer)
)

Effect.suspend(() => app(process.argv)).pipe(
  Effect.provide(layer),
  NodeRuntime.runMain
)
