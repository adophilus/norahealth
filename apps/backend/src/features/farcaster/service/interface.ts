import type { HexString } from '@nora-health/domain'
import { Context, type Effect } from 'effect'
import type { FarcasterServiceError } from './error'

export type VerifiedDetails = {
  fid: number
  message: string
  signature: HexString
}

export class FarcasterService extends Context.Tag('FarcasterService')<
  FarcasterService,
  {
    generateAuthCredentials: () => Effect.Effect<
      {
        url: string
        token: string
      },
      FarcasterServiceError
    >

    generateNonce: () => Effect.Effect<string, FarcasterServiceError>

    verifySignedData: (payload: {
      message: string
      signature: HexString
      nonce: string
    }) => Effect.Effect<VerifiedDetails, FarcasterServiceError>

    verifyChannelToken: (
      token: string
    ) => Effect.Effect<VerifiedDetails, FarcasterServiceError>

    // cast: (
    //   post: Post,
    //   signerUuid: string
    // ) => Effect.Effect<void, FarcasterServiceError>
  }
>() {}
