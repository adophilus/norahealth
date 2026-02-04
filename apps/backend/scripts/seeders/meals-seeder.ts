import { Effect } from 'effect'
import {
  KyselyClient,
  type KyselyDatabaseTables
} from '@/features/database/kysely'
import { meals } from './data/meals'
import { type SeederConfig, SeederError } from './types'
import type { Meal as TMeal } from '@/types'
import type { ControlledTransaction, Transaction } from 'kysely'

export const seedMeals = (config: SeederConfig) =>
  Effect.gen(function* () {
    const db = yield* KyselyClient

    if (config.clearExisting) {
      yield* clearExistingMeals()
      yield* Effect.logDebug('🗑️ Cleared existing meals')
    }

    let trx: ControlledTransaction<KyselyDatabaseTables>

    if (config.dryRun) {
      trx = yield* Effect.tryPromise(() => db.startTransaction().execute())
    }

    const batchSize = config.batchSize
    let insertedCount = 0

    for (let i = 0; i < meals.length; i += batchSize) {
      const batch = meals.slice(i, i + batchSize)
      yield* insertMealBatch(batch)
      insertedCount += batch.length
      const batchNum = Math.floor(i / batchSize) + 1
      const totalBatches = Math.ceil(meals.length / batchSize)
      yield* Effect.logDebug(
        `✅ Inserted batch ${batchNum}/${totalBatches} (${batch.length} meals)`
      )
    }

    if (config.dryRun) {
      yield* Effect.tryPromise(() => trx.commit().execute())
    }

    yield* Effect.logDebug(`🎉 Successfully seeded ${insertedCount} meals`)
  })

const clearExistingMeals = () =>
  Effect.gen(function* () {
    const db = yield* KyselyClient

    yield* Effect.tryPromise({
      try: () =>
        db.deleteFrom('meals').where('deleted_at', 'is', null).execute(),
      catch: (error) =>
        new SeederError({
          message: 'Failed to clear existing meals',
          cause: error
        })
    })
  })

const insertMealBatch = (batch: TMeal.Insertable[]) =>
  Effect.gen(function* () {
    const db = yield* KyselyClient

    yield* Effect.tryPromise({
      try: () => db.insertInto('meals').values(batch).execute(),
      catch: (error) =>
        new SeederError({
          message: `Failed to insert meal batch of ${batch.length} meals`,
          cause: error
        })
    })
  })
