import { VideoResponse } from '#infra/db/repository/interfaces/video-repository'

export abstract class IFavoriteService {
  abstract saveFavorite(videoUuid: string): Promise<boolean>
  abstract removeFavorite(videoUuid: string): Promise<boolean>
  abstract findFavoritesByUserLogged(): Promise<VideoResponse[]>
}
