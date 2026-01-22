import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { CreatePostEndpointLive } from './CreatePostEndpoint'
import { GetPostEndpointLive } from './GetPostEndpoint'
import { UpdatePostEndpointLive } from './UpdatePostEndpoint'
import { DeletePostEndpointLive } from './DeletePostEndpoint'
import { GetPostsEndpointLive } from './GetPostsEndpoint'

export const PostApiLive = HttpApiBuilder.group(Api, 'Post', (handlers) =>
  handlers
    .handle('createPost', CreatePostEndpointLive)
    .handle('getPost', GetPostEndpointLive)
    .handle('updatePost', UpdatePostEndpointLive)
    .handle('deletePost', DeletePostEndpointLive)
    .handle('getPosts', GetPostsEndpointLive)
)
