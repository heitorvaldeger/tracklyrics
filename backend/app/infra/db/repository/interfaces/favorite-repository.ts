import { VideoResponse } from './video-repository.js'

export abstract class IFavoriteRepository {
  abstract saveFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean>
  abstract removeFavorite(videoId: number, userId: number): Promise<boolean>
  abstract findFavoritesByUser(userId: number): Promise<VideoResponse[]>
  abstract isFavoriteByUser(userId: number, videoUuid: string): Promise<boolean>
}
