import type { NeynarSignerStatus } from '@nora-health/domain'
import { Context, type Option, type Effect } from 'effect'
import type { NeynarSigner as TNeynarSigner } from '@/types'
import type { NeynarSignerRepositoryError } from './error'

export class NeynarSignerRepository extends Context.Tag(
  'NeynarSignerRepository'
)<
  NeynarSignerRepository,
  {
    findById: (
      id: string
    ) => Effect.Effect<
      Option.Option<TNeynarSigner.Selectable>,
      NeynarSignerRepositoryError
    >

    findBySignerUuid: (
      signer_uuid: string
    ) => Effect.Effect<
      Option.Option<TNeynarSigner.Selectable>,
      NeynarSignerRepositoryError
    >

    findByFid: (
      fid: string
    ) => Effect.Effect<
      Option.Option<TNeynarSigner.Selectable>,
      NeynarSignerRepositoryError
    >

    create: (
      signer: TNeynarSigner.Insertable
    ) => Effect.Effect<TNeynarSigner.Selectable, NeynarSignerRepositoryError>

    updateById: (
      id: string,
      payload: TNeynarSigner.Updateable
    ) => Effect.Effect<
      Option.Option<TNeynarSigner.Selectable>,
      NeynarSignerRepositoryError
    >

    deleteById: (id: string) => Effect.Effect<void, NeynarSignerRepositoryError>
  }
>() {}
