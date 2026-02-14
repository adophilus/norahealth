import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { Recipe, UnexpectedError } from '../common'

export class GenerateRecipesRequestBody extends Schema.Class<GenerateRecipesRequestBody>(
    'GenerateRecipesRequestBody'
)({
    ingredients: Schema.Array(Schema.String),
    dietary_restrictions: Schema.Array(Schema.String).pipe(
        Schema.optional
    ),
    servings: Schema.Number.pipe(Schema.int(), Schema.positive())
}) {}

export class GenerateRecipesResponse extends Schema.Class<GenerateRecipesResponse>(
    'GenerateRecipesResponse'
)({
    recipes: Schema.Array(Recipe)
}) {}

const GenerateRecipesEndpoint = HttpApiEndpoint.post(
    'generateRecipes',
    '/meals/generate'
)
    .setPayload(GenerateRecipesRequestBody)
    .addSuccess(GenerateRecipesResponse, { status: StatusCodes.OK })
    .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
    .annotate(
        OpenApi.Description,
        'Generate recipes based on available ingredients and dietary restrictions'
    )

export default GenerateRecipesEndpoint