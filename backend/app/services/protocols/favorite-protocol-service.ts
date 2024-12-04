import { ApplicationError } from '#helpers/types/ApplicationError'
import { IMethodResponse } from '#helpers/types/IMethodResponse'

export abstract class FavoriteProtocolService {
  abstract addFavorite(videoUuid: string): Promise<IMethodResponse<boolean | ApplicationError>>
  abstract removeFavorite(videoUuid: string): Promise<IMethodResponse<boolean>>
  abstract findFavoritesByUserLogged(): Promise<IMethodResponse<any[]>>
}
