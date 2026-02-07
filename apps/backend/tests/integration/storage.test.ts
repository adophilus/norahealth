import { it, assert, describe, beforeAll } from '@effect/vitest'
import { Effect } from 'effect'
import type { MediaDescription, AuthSession, User } from '@nora-health/domain'
import { readFile } from 'node:fs/promises'
import { type ApiClient, makeApiClient, ServerLive } from '../utils'
import { generateMockUserWithSession } from '../utils/helpers'

describe('Storage API', () => {
  let Client: ApiClient
  let _user: User
  let session: AuthSession
  let file: File
  let uploadedFile: MediaDescription

  beforeAll(async () => {
    const res = await generateMockUserWithSession().pipe(
      Effect.provide(ServerLive),
      Effect.runPromise
    )
    _user = res.user
    session = res.session

    const fileData = await readFile('tests/assets/cube.png')
    const fileBlob = new Blob([Buffer.from(fileData)])
    file = new File([fileBlob], 'cube.png', { type: 'image/png' })

    Client = makeApiClient(session.id)
  })

  it.effect('should upload a file', () =>
    Effect.gen(function* () {
      const client = yield* Client

      const formData = new FormData()
      formData.append('files', file)

      const res = yield* client.Storage.uploadMedia({
        payload: formData
      })

      assert.strictEqual(res._tag, 'UploadMediaResponse')
      assert.isArray(res.data)
      assert.strictEqual(res.data.length, 1)

      uploadedFile = res.data[0]
    }).pipe(Effect.provide(ServerLive))
  )

  it.effect('should get a file by ID', () =>
    Effect.gen(function* () {
      const client = yield* Client

      const res = yield* client.Storage.getMedia({
        path: { fileId: uploadedFile.id }
      })

      assert.isDefined(res)
      assert.instanceOf(res, Uint8Array)
    }).pipe(Effect.provide(ServerLive))
  )

  it.effect('should delete a file by ID', () =>
    Effect.gen(function* () {
      const client = yield* Client

      const res = yield* client.Storage.deleteMedia({
        path: { fileId: uploadedFile.id }
      })

      assert.strictEqual(res._tag, 'DeleteMediaResponse')
    }).pipe(Effect.provide(ServerLive))
  )
})
