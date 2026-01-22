import { Context, type Effect } from 'effect'
import type {
  NeynarServiceError,
  NeynarServiceSignerNotFoundError
} from './error'
import type {
  NeynarSigner,
  HexString,
  RawNeynarSigner,
  NeynarSignerWithApproval
} from '@nora-health/domain'
import type { NeynarSigner as TNeynarSigner } from '@/types'

export class NeynarService extends Context.Tag('NeynarService')<
  NeynarService,
  {
    fetchRawSigners: ({
      message,
      signature
    }: {
      message: string
      signature: HexString
    }) => Effect.Effect<RawNeynarSigner[], NeynarServiceError>

    create: (
      payload: Omit<
        TNeynarSigner.Insertable,
        'public_key' | 'signer_uuid' | 'fid' | 'status'
      >
    ) => Effect.Effect<NeynarSigner, NeynarServiceError>

    registerSignedKey: (
      signer: NeynarSigner
    ) => Effect.Effect<NeynarSignerWithApproval, NeynarServiceError>

    lookupRawSignerByUuid: (
      signerUuid: string
    ) => Effect.Effect<
      NeynarSigner,
      NeynarServiceSignerNotFoundError | NeynarServiceError
    >

    findById: (
      id: string
    ) => Effect.Effect<
      NeynarSigner,
      NeynarServiceSignerNotFoundError | NeynarServiceError
    >

    updateById: (
      id: string,
      payload: TNeynarSigner.Updateable
    ) => Effect.Effect<
      NeynarSigner,
      NeynarServiceSignerNotFoundError | NeynarServiceError
    >

    findBySignerUuid: (
      signerUuid: string
    ) => Effect.Effect<
      NeynarSigner,
      NeynarServiceSignerNotFoundError | NeynarServiceError
    >

    // publishCast: (params: {
    //   signerUuid: string
    //   text: string
    // }) => Effect.Effect<{ hash: string }, NeynarServiceError>
  }
>() {}
