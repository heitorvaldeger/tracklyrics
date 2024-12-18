import { ApplicationError } from '#helpers/types/application-error'
import { MethodResponse } from '#helpers/types/method-response'
import { VideoFindModel } from '#models/video-model/video-find-model'

export abstract class FavoriteProtocolService {
  abstract addFavorite(videoUuid: string): Promise<MethodResponse<boolean | ApplicationError>>
  abstract removeFavorite(videoUuid: string): Promise<MethodResponse<boolean>>
  abstract findFavoritesByUserLogged(): Promise<MethodResponse<VideoFindModel[] | ApplicationError>>
}
