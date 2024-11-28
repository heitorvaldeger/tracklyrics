import { ApplicationError } from '#helpers/types/ApplicationError'
import { IMethodResponse } from '#helpers/types/IMethodResponse'

export abstract class VideoFavoriteProtocolService {
  abstract addFavorite(videoUuid: string): Promise<IMethodResponse<boolean | ApplicationError>>
  abstract removeFavorite(videoUuid: string): Promise<IMethodResponse<boolean>>
}
