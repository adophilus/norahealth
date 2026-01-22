import { createAppClient, viemConnector } from '@farcaster/auth-client'
import { HexString } from '@nora-health/domain'
import { Effect, Layer, Schema } from 'effect'
import { ulid } from 'ulidx'
import { FarcasterServiceError } from './error'
import { FarcasterService } from './interface'

const ChannelData = Schema.Union(
  Schema.Struct({
    state: Schema.Literal('pending')
  }),
  Schema.Struct({
    state: Schema.Literal('completed'),
    fid: Schema.Number,
    message: Schema.String,
    signature: HexString
  })
)

export const FarcasterServiceLive = Layer.effect(
  FarcasterService,
  Effect.gen(function* () {
    const domain = 'nora-health.xyz'

    const client = createAppClient({
      relay: 'https://relay.farcaster.xyz',
      ethereum: viemConnector()
    })

    const verifySignedData = (payload: {
      message: string
      signature: HexString
      nonce: string
    }) =>
      Effect.gen(function* () {
        const res = yield* Effect.tryPromise({
          try: () =>
            client.verifySignInMessage({
              ...payload,
              domain,
              acceptAuthAddress: true
            }),
          catch: (error) =>
            new FarcasterServiceError({
              message: 'Failed to verify signed data',
              cause: error
            })
        })

        if (!res.success) {
          return yield* Effect.fail(
            new FarcasterServiceError({
              message: 'Failed to verify signed data',
              cause: res
            })
          )
        }

        const { fid } = yield* Effect.promise(() =>
          client.verifySignInMessage({
            domain,
            acceptAuthAddress: true,
            nonce: res.data.nonce,
            message: payload.message,
            signature: payload.signature
          })
        )

        return { fid, message: payload.message, signature: payload.signature }
      })

    const validateChannelData = Schema.decodeUnknown(ChannelData)

    return FarcasterService.of({
      generateAuthCredentials: () =>
        Effect.gen(function* () {
          const channel = yield* Effect.tryPromise({
            try: () =>
              client.createChannel({
                siweUri: 'https://nora-health.xyz',
                domain
              }),
            catch: (error) =>
              new FarcasterServiceError({
                message: `Failed to create Farcaster channel: ${String(error)}`,
                cause: error
              })
          })

          if (channel.error) {
            return yield* new FarcasterServiceError({
              message: channel.error.message,
              cause: channel.error
            })
          }

          return { token: channel.data.channelToken, url: channel.data.url }
        }),

      generateNonce: () => Effect.sync(ulid),

      verifySignedData,

      verifyChannelToken: (token) =>
        Effect.gen(function* () {
          const res = yield* Effect.tryPromise({
            try: () => client.status({ channelToken: token }),
            catch: (error) =>
              new FarcasterServiceError({
                message: `Failed to finalize Farcaster channel: ${String(
                  error
                )}`,
                cause: error
              })
          })

          if (res.error) {
            return yield* new FarcasterServiceError({
              message: res.error.message,
              cause: res.error
            })
          }

          const data = yield* validateChannelData(res.data).pipe(
            Effect.mapError(
              (error) =>
                new FarcasterServiceError({
                  message: 'API validation error',
                  cause: error
                })
            )
          )

          if (data.state === 'pending') {
            return yield* new FarcasterServiceError({
              message: 'Farcaster channel is still pending',
              cause: res.data
            })
          }

          return {
            fid: res.data.fid!,
            message: res.data.message!,
            signature: res.data.signature!
          }
          // return yield* verifySignedData({
          //   nonce: res.data.nonce!,
          //   message: res.data.message!,
          //   signature: res.data.signature!
          // })
        })

      // cast: (post: Post, signerUuid: string) =>
      //   Effect.gen(function* () {
      //     const neynarService = yield* NeynarService
      //     const user = yield* UserService
      //     const authProfileService = yield* AuthProfileService
      //
      //     const signerDetails = yield* Effect.tryPromise({
      //       try: () => client.getSignerBySignerToken(signerUuid),
      //       catch: (error) =>
      //         new FarcasterServiceError({
      //           message: 'Failed to get signer details from Farcaster',
      //           cause: error
      //         })
      //     })
      //
      //     if (!signerDetails.success) {
      //       return yield* new FarcasterServiceError({
      //         message: 'Signer not found or inactive',
      //         cause: signerDetails
      //       })
      //     }
      //
      //     yield* neynarService.publishCast({
      //       signer_uuid: signerUuid,
      //       text: post.text,
      //       embeds: post.media_ids
      //         ? post.media_ids.map((id) => ({
      //             url: `https://media.nora-health.xyz/${id}`
      //           }))
      //         : undefined
      //     })
      //
      //     if (user._tag === 'None') {
      //       const newUser = yield* user
      //       if (newUser._tag === 'None') {
      //         const profileOption =
      //           yield* authProfileService.findByFarcasterFid(
      //             signerDetails.data.fid.toString()
      //           )
      //
      //         if (profileOption._tag === 'None') {
      //           yield* authProfileService.create({
      //             id: ulid(),
      //             user_id: user.value.id,
      //             meta: {
      //               key: 'FARCASTER',
      //               fid: signerDetails.data.fid.toString()
      //             }
      //           })
      //         }
      //       }
      //     }
      //   }),
    })
  })
)
