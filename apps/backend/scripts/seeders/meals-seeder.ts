import { Meal } from '@nora-health/domain'
import { Effect } from 'effect'
import { KyselyClient } from '@/features/database/kysely'
import { ulid } from 'ulidx'
import { mealsData } from './data/meals'
import { type SeederConfig, SeederError } from './types'
import type { Meal as TMeal } from '@/types'

export const seedMeals = (config: SeederConfig) =>
  Effect.gen(function* () {
    if (config.clearExisting) {
      yield* clearExistingMeals()
      console.log('🗑️ Cleared existing meals')
    }

    const meals = mealsData.map((seedMeal) => {
      const parsedMeal = Meal.make({
        id: ulid(),
        name: seedMeal.name,
        description: seedMeal.description || null,
        food_classes: seedMeal.food_classes,
        calories: seedMeal.calories || null,
        protein: seedMeal.protein || null,
        carbs: seedMeal.carbs || null,
        fat: seedMeal.fat || null,
        prep_time_minutes: seedMeal.prep_time_minutes || null,
        cover_image_id: null,
        allergens: seedMeal.allergens as any,
        is_prepackaged: seedMeal.is_prepackaged,
        fitness_goals: seedMeal.fitness_goals,
        created_at: Date.now()
      })

      return {
        id: parsedMeal.id,
        name: parsedMeal.name,
        description: parsedMeal.description,
        food_classes: JSON.stringify(parsedMeal.food_classes),
        calories: parsedMeal.calories,
        protein: parsedMeal.protein,
        carbs: parsedMeal.carbs,
        fat: parsedMeal.fat,
        prep_time_minutes: parsedMeal.prep_time_minutes,
        cover_image_id: parsedMeal.cover_image_id,
        allergens: JSON.stringify(parsedMeal.allergens),
        is_prepackaged: parsedMeal.is_prepackaged,
        fitness_goals: JSON.stringify(parsedMeal.fitness_goals),
        created_at: parsedMeal.created_at
      }
    })

    if (config.dryRun) {
      console.log(`🧪 Dry run: Would insert ${meals.length} meals`)
      meals.forEach((meal) => {
        console.log(`  - ${meal.name}`)
      })
      return { success: true, count: meals.length, dryRun: true }
    }

    const batchSize = config.batchSize || 100
    let insertedCount = 0

    for (let i = 0; i < meals.length; i += batchSize) {
      const batch = meals.slice(i, i + batchSize)
      yield* insertMealBatch(batch)
      insertedCount += batch.length
      const batchNum = Math.floor(i / batchSize) + 1
      const totalBatches = Math.ceil(meals.length / batchSize)
      console.log(
        `✅ Inserted batch ${batchNum}/${totalBatches} (${batch.length} meals)`
      )
    }

    console.log(`🎉 Successfully seeded ${insertedCount} meals`)
    return { success: true, count: insertedCount, dryRun: false }
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

const insertMealBatch = (batch: TMeal.Insertabl[]) =>
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
