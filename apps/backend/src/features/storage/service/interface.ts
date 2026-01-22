import { Context, type Effect, type Option } from 'effect'
import type { StorageFile } from '@/types'
import type {
  StorageServiceError,
  StorageServiceNotFoundError,
  StorageServiceUploadError,
  StorageServiceValidationError
} from './error'
import type { MediaDescription } from '@nora-health/domain'

export class StorageService extends Context.Tag('StorageService')<
  StorageService,
  {
    upload: (
      payload: File,
      userId: string
    ) => Effect.Effect<
      StorageFile.Selectable,
      StorageServiceValidationError | StorageServiceUploadError
    >
    uploadMany: (
      payload: Array<File>,
      userId: string
    ) => Effect.Effect<
      Array<StorageFile.Selectable>,
      StorageServiceValidationError | StorageServiceUploadError
    >
    get: (
      id: string
    ) => Effect.Effect<
      StorageFile.Selectable,
      StorageServiceNotFoundError | StorageServiceError
    >
    delete: (
      id: string
    ) => Effect.Effect<void, StorageServiceNotFoundError | StorageServiceError>
    findByUserId: (
      userId: string
    ) => Effect.Effect<StorageFile.Selectable[], StorageServiceError>
    convertToMediaDescription(payload: StorageFile.Selectable): MediaDescription
  }
>() {}
