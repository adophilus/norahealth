import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { DeleteMediaSuccessResponse } from '@nora-health/api/Storage/DeleteMediaEndpoint'
import FileNotFoundError from '@nora-health/api/common/FileNotFoundError'
import UnexpectedError from '@nora-health/api/common/UnexpectedError'
import { StorageService } from '../service'

export const DeleteMediaEndpointLive = HttpApiBuilder.handler(
  Api,
  'Storage',
  'deleteMedia',
  ({ path }) =>
    Effect.gen(function* () {
      const storage = yield* StorageService

      yield* storage.delete(path.fileId).pipe(
        Effect.catchTags({
          StorageServiceNotFoundError: () => new FileNotFoundError(),
          StorageServiceError: () => new UnexpectedError()
        })
      )

      return new DeleteMediaSuccessResponse({})
    })
)
