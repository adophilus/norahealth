import { Effect, Option } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import FileNotFoundError from '@nora-health/api/common/FileNotFoundError'
import UnexpectedError from '@nora-health/api/common/UnexpectedError'
import { StorageService } from '../service'

export const GetMediaEndpointLive = HttpApiBuilder.handler(
  Api,
  'Storage',
  'getMedia',
  ({ path }) =>
    Effect.gen(function* () {
      const storageService = yield* StorageService

      const file = yield* storageService.get(path.fileId)
      return file.file_data
    }).pipe(
      Effect.catchTags({
        StorageServiceNotFoundError: () => Effect.fail(new FileNotFoundError()),
        StorageServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message }))
      })
    )
)
