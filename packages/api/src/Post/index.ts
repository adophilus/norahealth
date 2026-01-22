import { HttpApiGroup } from '@effect/platform'
import CreatePostEndpoint from './CreatePostEndpoint'
import GetPostEndpoint from './GetPostEndpoint'
import UpdatePostEndpoint from './UpdatePostEndpoint'
import DeletePostEndpoint from './DeletePostEndpoint'
import GetPostsEndpoint from './GetPostsEndpoint'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'

const PostApi = HttpApiGroup.make('Post')
  .add(CreatePostEndpoint)
  .add(GetPostEndpoint)
  .add(UpdatePostEndpoint)
  .add(DeletePostEndpoint)
  .add(GetPostsEndpoint)
  .middleware(AuthenticationMiddleware)

export default PostApi
