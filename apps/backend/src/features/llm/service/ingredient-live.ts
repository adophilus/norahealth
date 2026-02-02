import { Effect, Layer } from 'effect'
import {
  type DietaryExclusion,
  type IngredientInfo,
  IngredientService,
  type IngredientServiceOperationError,
  type ValidationResult
} from './ingredient'
import { LLMService } from './interface'

const BASIC_INGREDIENT_DATABASE: Record<string, IngredientInfo> = {
  // Dairy
  milk: {
    name: 'milk',
    categories: ['DAIRY'],
    alternatives: ['almond milk', 'soy milk', 'oat milk']
  },
  cheese: {
    name: 'cheese',
    categories: ['DAIRY'],
    alternatives: ['vegan cheese', 'nutritional yeast']
  },
  butter: {
    name: 'butter',
    categories: ['DAIRY'],
    alternatives: ['coconut oil', 'olive oil', 'vegan butter']
  },
  yogurt: {
    name: 'yogurt',
    categories: ['DAIRY'],
    alternatives: ['coconut yogurt', 'soy yogurt']
  },
  cream: {
    name: 'cream',
    categories: ['DAIRY'],
    alternatives: ['coconut cream', 'cashew cream']
  },

  // Eggs
  eggs: {
    name: 'eggs',
    categories: ['EGGS'],
    alternatives: ['flax eggs', 'chia eggs', 'aquafaba']
  },
  'egg whites': {
    name: 'egg whites',
    categories: ['EGGS'],
    alternatives: ['aquafaba']
  },

  // Gluten
  'wheat flour': {
    name: 'wheat flour',
    categories: ['GLUTEN'],
    alternatives: ['almond flour', 'coconut flour', 'rice flour']
  },
  bread: {
    name: 'bread',
    categories: ['GLUTEN'],
    alternatives: ['gluten-free bread']
  },
  pasta: {
    name: 'pasta',
    categories: ['GLUTEN'],
    alternatives: ['rice pasta', 'quinoa pasta']
  },
  barley: {
    name: 'barley',
    categories: ['GLUTEN'],
    alternatives: ['quinoa', 'rice']
  },
  rye: {
    name: 'rye',
    categories: ['GLUTEN'],
    alternatives: ['cornmeal', 'oats']
  },

  // Peanuts
  peanuts: {
    name: 'peanuts',
    categories: ['PEANUTS'],
    alternatives: ['almonds', 'cashews', 'sunflower seeds']
  },
  'peanut butter': {
    name: 'peanut butter',
    categories: ['PEANUTS'],
    alternatives: ['almond butter', 'sunflower butter']
  },

  // Tree nuts
  almonds: {
    name: 'almonds',
    categories: ['TREE_NUTS'],
    alternatives: ['seeds', 'coconut']
  },
  cashews: {
    name: 'cashews',
    categories: ['TREE_NUTS'],
    alternatives: ['seeds', 'coconut']
  },
  walnuts: {
    name: 'walnuts',
    categories: ['TREE_NUTS'],
    alternatives: ['seeds', 'coconut']
  },
  pecans: {
    name: 'pecans',
    categories: ['TREE_NUTS'],
    alternatives: ['seeds']
  },

  // Soy
  'soy sauce': {
    name: 'soy sauce',
    categories: ['SOY'],
    alternatives: ['coconut aminos', 'tamari']
  },
  tofu: {
    name: 'tofu',
    categories: ['SOY'],
    alternatives: ['tempeh', 'seitan']
  },
  edamame: {
    name: 'edamame',
    categories: ['SOY'],
    alternatives: ['green beans']
  },

  // Shellfish
  shrimp: {
    name: 'shrimp',
    categories: ['SHELLFISH'],
    alternatives: ['mock shrimp', 'tofu']
  },
  lobster: {
    name: 'lobster',
    categories: ['SHELLFISH'],
    alternatives: ['king oyster mushrooms']
  },
  crab: {
    name: 'crab',
    categories: ['SHELLFISH'],
    alternatives: ['hearts of palm']
  },
  clams: {
    name: 'clams',
    categories: ['SHELLFISH'],
    alternatives: ['mushrooms']
  },

  // Fish
  salmon: {
    name: 'salmon',
    categories: ['FISH'],
    alternatives: ['tofu', 'tempeh']
  },
  tuna: {
    name: 'tuna',
    categories: ['FISH'],
    alternatives: ['chickpeas', 'jackfruit']
  },
  cod: { name: 'cod', categories: ['FISH'], alternatives: ['tofu'] }
}

const ingredientDatabase: Record<string, IngredientInfo> = {
  ...BASIC_INGREDIENT_DATABASE
}

const normalizeIngredient = (ingredient: string): string => {
  return ingredient.toLowerCase().trim()
}

const findIngredient = (ingredient: string): IngredientInfo | undefined => {
  const normalized = normalizeIngredient(ingredient)
  return ingredientDatabase[normalized]
}

export const IngredientServiceLive = Layer.effect(
  IngredientService,
  Effect.gen(function* () {
    const llm = yield* LLMService

    return IngredientService.of({
      validateIngredients: (ingredients, restrictions) =>
        Effect.gen(function* () {
          const valid: string[] = []
          const invalid: Array<{
            ingredient: string
            restrictions: DietaryExclusion[]
          }> = []

          for (const ingredient of ingredients) {
            const ingredientInfo = findIngredient(ingredient)

            if (!ingredientInfo) {
              const categories = yield* llm.categorizeIngredients([ingredient])
              const ingredientRestrictions = Object.values(categories)[0] || []

              if (
                ingredientRestrictions.some((cat) =>
                  restrictions.includes(cat as DietaryExclusion)
                )
              ) {
                invalid.push({
                  ingredient,
                  restrictions: ingredientRestrictions.filter((cat) =>
                    restrictions.includes(cat as DietaryExclusion)
                  ) as DietaryExclusion[]
                })
              } else {
                valid.push(ingredient)
              }
            } else {
              const hasRestriction = ingredientInfo.categories.some((cat) =>
                restrictions.includes(cat)
              )

              if (hasRestriction) {
                invalid.push({
                  ingredient,
                  restrictions: ingredientInfo.categories.filter((cat) =>
                    restrictions.includes(cat)
                  )
                })
              } else {
                valid.push(ingredient)
              }
            }
          }

          return { valid, invalid }
        }),

      categorizeIngredient: (ingredient) =>
        Effect.gen(function* () {
          const ingredientInfo = findIngredient(ingredient)

          if (ingredientInfo) {
            return ingredientInfo.categories
          }

          const categories = yield* llm.categorizeIngredients([ingredient])
          const ingredientCategories = Object.values(categories)[0] || []
          return ingredientCategories.filter((cat): cat is DietaryExclusion =>
            [
              'PEANUTS',
              'DAIRY',
              'GLUTEN',
              'SOY',
              'EGGS',
              'SHELLFISH',
              'TREE_NUTS',
              'FISH'
            ].includes(cat)
          )
        }),

      suggestAlternatives: (ingredient, restrictions) =>
        Effect.gen(function* () {
          const ingredientInfo = findIngredient(ingredient)

          if (ingredientInfo && ingredientInfo.alternatives) {
            const validAlternatives = ingredientInfo.alternatives.filter(
              (alt) => {
                const altInfo = findIngredient(alt)
                if (!altInfo) return true
                return !altInfo.categories.some((cat) =>
                  restrictions.includes(cat)
                )
              }
            )
            return validAlternatives
          }

          const prompt = `Suggest 3-5 ingredient alternatives for "${ingredient}" that are suitable for someone avoiding: ${restrictions.join(', ')}. Return only the ingredient names, one per line.`
          const alternativesText = yield* llm.generateText(prompt, {
            temperature: 0.5,
            maxTokens: 100
          })

          return alternativesText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, 5)
        }),

      addToDatabase: (ingredient) =>
        Effect.sync(() => {
          ingredientDatabase[normalizeIngredient(ingredient.name)] = ingredient
        })
    })
  })
)
