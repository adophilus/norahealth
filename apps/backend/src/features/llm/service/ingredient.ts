import { Context, type Effect } from 'effect'
import type {
  LLMServiceError,
  LLMServiceGenerationError,
  LLMServiceTimeoutError
} from './error'

export type IngredientServiceOperationError =
  | LLMServiceError
  | LLMServiceGenerationError
  | LLMServiceTimeoutError

export type DietaryExclusion =
  | 'PEANUTS'
  | 'DAIRY'
  | 'GLUTEN'
  | 'SOY'
  | 'EGGS'
  | 'SHELLFISH'
  | 'TREE_NUTS'
  | 'FISH'

export type IngredientInfo = {
  name: string
  categories: DietaryExclusion[]
  alternatives?: string[]
}

export type ValidationResult = {
  valid: string[]
  invalid: Array<{ ingredient: string; restrictions: DietaryExclusion[] }>
}

export class IngredientService extends Context.Tag('IngredientService')<
  IngredientService,
  {
    validateIngredients: (
      ingredients: string[],
      restrictions: DietaryExclusion[]
    ) => Effect.Effect<ValidationResult, IngredientServiceOperationError>

    categorizeIngredient: (
      ingredient: string
    ) => Effect.Effect<DietaryExclusion[], IngredientServiceOperationError>

    suggestAlternatives: (
      ingredient: string,
      restrictions: DietaryExclusion[]
    ) => Effect.Effect<string[], IngredientServiceOperationError>

    addToDatabase: (ingredient: IngredientInfo) => Effect.Effect<void, never>
  }
>() {}
