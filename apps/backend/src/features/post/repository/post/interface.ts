import { Context, type Effect, type Option } from 'effect'
import type { Post } from '@/types'
import type { PostRepositoryError } from './error'

export class PostRepository extends Context.Tag('PostRepository')<
  PostRepository,
  {
    create(
      payload: Post.Insertable
    ): Effect.Effect<Post.Selectable, PostRepositoryError>
    findById(
      id: Post.Selectable['id']
    ): Effect.Effect<Option.Option<Post.Selectable>, PostRepositoryError>
    findByUserId(
      userId: Post.Selectable['user_id']
    ): Effect.Effect<Post.Selectable[], PostRepositoryError>
    update(
      id: Post.Selectable['id'],
      payload: Post.Updateable
    ): Effect.Effect<Option.Option<Post.Selectable>, PostRepositoryError>
    delete(
      id: Post.Selectable['id']
    ): Effect.Effect<Option.Option<Post.Selectable>, PostRepositoryError>
  }
>() {}
