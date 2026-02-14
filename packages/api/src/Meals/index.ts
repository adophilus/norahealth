import { HttpApiGroup } from '@effect/platform'
// import GenerateRecipesEndpoint from './GenerateRecipesEndpoint'
// import UploadFridgePhotoEndpoint from './UploadFridgePhotoEndpoint'

const MealsApi = HttpApiGroup.make('Meals')
// .add(UploadFridgePhotoEndpoint)
// .add(GenerateRecipesEndpoint)

export default MealsApi
