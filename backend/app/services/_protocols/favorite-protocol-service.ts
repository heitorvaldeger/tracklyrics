import { ApplicationError } from '#helpers/types/application-error'
import { MethodResponse } from '#helpers/types/method-response'
import { VideoMetadata } from '#models/video-metadata'

export abstract class FavoriteProtocolService {
  abstract addFavorite(videoUuid: string): Promise<MethodResponse<boolean | ApplicationError>>
  abstract removeFavorite(videoUuid: string): Promise<MethodResponse<boolean>>
  abstract findFavoritesByUserLogged(): Promise<MethodResponse<VideoMetadata[] | ApplicationError>>
}
