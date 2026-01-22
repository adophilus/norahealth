import { Context, type Effect, type Option } from 'effect'
import type { Post, PostPlatform } from '@/types'
import type { PostPlatformRepositoryError } from './error'

export class PostPlatformRepository extends Context.Tag(
  'PostPlatformRepository'
)<
  PostPlatformRepository,
  {
    create(
      payload: PostPlatform.Insertable
    ): Effect.Effect<PostPlatform.Selectable, PostPlatformRepositoryError>
    findById(
      id: PostPlatform.Selectable['id']
    ): Effect.Effect<
      Option.Option<PostPlatform.Selectable>,
      PostPlatformRepositoryError
    >
    findByPostId(
      postId: Post.Selectable['id']
    ): Effect.Effect<PostPlatform.Selectable[], PostPlatformRepositoryError>
    updateById(
      id: PostPlatform.Selectable['id'],
      payload: PostPlatform.Updateable
    ): Effect.Effect<
      Option.Option<PostPlatform.Selectable>,
      PostPlatformRepositoryError
    >
    deleteById(
      id: PostPlatform.Selectable['id']
    ): Effect.Effect<
      Option.Option<PostPlatform.Selectable>,
      PostPlatformRepositoryError
    >
  }
>() {}
