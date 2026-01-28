import { HttpApiEndpoint, OpenApi, Schema } from '@effect/platform'
import Recipe from '@nora-health/domain/Recipe'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthorizedError } from '../common'

export class GenerateRecipesRequestBody extends Schema.Class<GenerateRecipesRequestBody>(
  'GenerateRecipesRequestBody'
)({
  available_ingredients: Schema.Array(Schema.String),
  dietary_exclusions: Schema.Array(
    Schema.Literal(
      'PEANUTS',
      'DAIRY',
      'GLUTEN',
      'SOY',
      'EGGS',
      'SHELLFISH',
      'TREE_NUTS',
      'FISH'
    )
  ),
  fitness_goal: Schema.Literal('PERFORMANCE', 'VITALITY', 'LONGEVITY'),
  servings: Schema.Number
}) {}

export class GenerateRecipesSuccessResponse extends Schema.TaggedClass(
  'GenerateRecipesSuccessResponse'
)({
  recipes: Schema.Array(Recipe)
}) {}

const GenerateRecipesEndpoint = HttpApiEndpoint.post(
  'generateRecipes',
  '/meals/recipes/generate'
)
  .setPayload(GenerateRecipesRequestBody)
  .addSuccess(GenerateRecipesSuccessResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .annotate(OpenApi.Description, 'Generate personalized recipes')

export default GenerateRecipesEndpoint
