import { Effect, Layer, Schema, Option } from 'effect'
import { concat, encodeAbiParameters, keccak256, toHex } from 'viem'
import { mnemonicToAccount, signTypedData } from 'viem/accounts'
import { AppConfig } from '@/features/config'
import { NeynarServiceError, NeynarServiceSignerNotFoundError } from './error'
import { NeynarService } from './interface'
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk'
import {
  NeynarSigner,
  NeynarSignerApproval,
  NeynarSignerWithApproval,
  RawNeynarSigner
} from '@nora-health/domain'
import type { Signer } from '@neynar/nodejs-sdk/build/api'
import { addDays, getUnixTime } from 'date-fns'
import { NeynarSignerRepository } from '../repository'

export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: 'Farcaster SignedKeyRequestValidator',
  version: '1',
  chainId: 10,
  verifyingContract:
    '0x00000000fc700472606ed4fa22623acf62c60553' as `0x${string}`
}

export const SIGNED_KEY_REQUEST_TYPE = [
  { name: 'requestFid', type: 'uint256' },
  { name: 'key', type: 'bytes' },
  { name: 'deadline', type: 'uint256' }
]

const approvalStringToDomain = (approval: string) =>
  Effect.gen(function* () {
    const approvalJson = yield* Effect.try(() => JSON.parse(approval))
    const decoder = Schema.decodeUnknown(NeynarSignerApproval)
    return yield* decoder(approvalJson)
  }).pipe(
    Effect.mapError(
      (error) =>
        new NeynarServiceError({
          message: 'Failed to parse approval',
          cause: error
        })
    )
  )

export const NeynarServiceLive = Layer.effect(
  NeynarService,
  Effect.gen(function* () {
    const config = yield* AppConfig
    const account = yield* Effect.try({
      try: () => mnemonicToAccount(config.neynar.seedPhrase),
      catch: (error) =>
        new NeynarServiceError({
          message: 'Failed to create account',
          cause: error
        })
    })
    const neynarSignerRepository = yield* NeynarSignerRepository

    const client = new NeynarAPIClient(
      new Configuration({
        apiKey: config.neynar.apiKey,
        // basePath: 'http://localhost:8081'
      })
    )

    // const {
    //   user: { fid: appFid }
    // } = yield* Effect.tryPromise({
    //   try: () =>
    //     client.lookupUserByCustodyAddress({
    //       custodyAddress: account.address
    //     }),
    //   catch: (error) =>
    //     new NeynarServiceError({
    //       message: 'Failed to lookup user',
    //       cause: error
    //     })
    // })

    return NeynarService.of({
      fetchRawSigners: ({ message, signature }) =>
        Effect.tryPromise({
          try: () =>
            client
              .fetchSigners({
                message,
                signature
              })
              .then((res) => res.signers.map(RawNeynarSigner.make)),
          catch: (error) =>
            new NeynarServiceError({
              message: 'Failed to fetch signers',
              cause: error
            })
        }),

      create: (payload) =>
        Effect.gen(function* () {
          const rawSignerData = yield* Effect.tryPromise({
            try: () => client.createSigner().then(RawNeynarSigner.make),
            catch: (error) =>
              new NeynarServiceError({
                message: 'Failed to create signer',
                cause: error
              })
          })

          const dbNeynarSigner = yield* neynarSignerRepository.create({
            ...payload,
            ...rawSignerData,
            fid: rawSignerData.fid?.toString() ?? null
          })

          return NeynarSigner.make({
            ...dbNeynarSigner,
            approval: dbNeynarSigner.approval
              ? yield* approvalStringToDomain(dbNeynarSigner.approval)
              : null
          })
        }).pipe(
          Effect.catchTags({
            NeynarSignerRepositoryError: (error) =>
              Effect.fail(
                new NeynarServiceError({
                  message: 'Failed to create neynar signer',
                  cause: error
                })
              )
          })
        ),

      registerSignedKey: (signer) =>
        Effect.gen(function* () {
          const deadline = getUnixTime(addDays(new Date(), 1))

          const signature = yield* Effect.tryPromise({
            try: () =>
              account.signTypedData({
                domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
                types: {
                  SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE
                },
                primaryType: 'SignedKeyRequest',
                message: {
                  requestFid: BigInt(appFid),
                  key: signer.public_key,
                  deadline: BigInt(deadline)
                }
              }),
            catch: (error) =>
              new NeynarServiceError({
                message: 'Failed to sign message',
                cause: error
              })
          })

          const { signer_approval_url } = yield* Effect.tryPromise({
            try: () =>
              client.registerSignedKey({
                appFid: appFid,
                deadline,
                signature,
                signerUuid: signer.signer_uuid,
                sponsor: { sponsored_by_neynar: true }
              }),
            catch: (error) =>
              new NeynarServiceError({
                message: 'Failed to register signed key',
                cause: error
              })
          })

          const approval = NeynarSignerApproval.make({
            url: signer_approval_url!,
            deadline
          })

          yield* neynarSignerRepository.updateById(signer.id, {
            approval: JSON.stringify(approval)
          })

          return NeynarSignerWithApproval.make({
            ...signer,
            approval
          })
        }).pipe(
          Effect.catchTags({
            NeynarSignerRepositoryError: (error) =>
              Effect.fail(
                new NeynarServiceError({
                  message: 'Failed to register signed key',
                  cause: error
                })
              )
          })
        ),

      lookupRawSignerByUuid: (signerUuid) =>
        Effect.tryPromise({
          try: () =>
            client.lookupSigner({ signerUuid }).then(RawNeynarSigner.make),
          catch: (error) =>
            new NeynarServiceError({
              message: 'Failed to lookup signer',
              cause: error
            })
        }),

      findById: (id) =>
        Effect.gen(function* () {
          const ns = yield* neynarSignerRepository.findById(id).pipe(
            Effect.flatMap(
              Option.match({
                onSome: Effect.succeed,
                onNone: () =>
                  Effect.fail(new NeynarServiceSignerNotFoundError({}))
              })
            )
          )

          return NeynarSigner.make({
            ...ns,
            approval: ns.approval
              ? yield* approvalStringToDomain(ns.approval)
              : null
          })
        }).pipe(
          Effect.catchTags({
            NeynarSignerRepositoryError: (error) =>
              Effect.fail(
                new NeynarServiceError({
                  message: 'Failed to find signer by id',
                  cause: error
                })
              )
          })
        ),

      findBySignerUuid: (signerUuid) =>
        Effect.gen(function* () {
          const ns = yield* neynarSignerRepository
            .findBySignerUuid(signerUuid)
            .pipe(
              Effect.flatMap(
                Option.match({
                  onSome: Effect.succeed,
                  onNone: () =>
                    Effect.fail(new NeynarServiceSignerNotFoundError({}))
                })
              )
            )

          return NeynarSigner.make({
            ...ns,
            approval: ns.approval
              ? yield* approvalStringToDomain(ns.approval)
              : null
          })
        }).pipe(
          Effect.catchTags({
            NeynarSignerRepositoryError: (error) =>
              Effect.fail(
                new NeynarServiceError({
                  message: 'Failed to find signer by uuid',
                  cause: error
                })
              )
          })
        ),

      updateById: (id, payload) =>
        Effect.gen(function* () {
          const ns = yield* neynarSignerRepository.updateById(id, payload).pipe(
            Effect.flatMap(
              Option.match({
                onSome: Effect.succeed,
                onNone: () =>
                  Effect.fail(new NeynarServiceSignerNotFoundError({}))
              })
            )
          )

          return NeynarSigner.make({
            ...ns,
            approval: ns.approval
              ? yield* approvalStringToDomain(ns.approval)
              : null
          })
        }).pipe(
          Effect.catchTags({
            NeynarSignerRepositoryError: (error) =>
              Effect.fail(
                new NeynarServiceError({
                  message: 'Failed to find signer by id',
                  cause: error
                })
              )
          })
        )

      // publishCast: ({ signer_uuid, text, embeds }) =>
      //   Effect.tryPromise({
      //     try: () =>
      //       makeRequest<{ hash: string; fid: number }>('/cast', {
      //         method: 'POST',
      //         body: JSON.stringify({
      //           signer_uuid,
      //           text,
      //           embeds: embeds || []
      //         })
      //       }),
      //     catch: (error) =>
      //       new NeynarServiceError({
      //         message: 'Failed to publish cast',
      //         cause: error
      //       })
      //   })
    })
  })
)
