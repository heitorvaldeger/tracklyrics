import { VideoMetadata } from '#models/video-metadata'

export abstract class FavoriteRepository {
  abstract saveFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean>
  abstract removeFavorite(videoId: number, userId: number): Promise<boolean>
  abstract findFavoritesByUser(userId: number): Promise<VideoMetadata[]>
  abstract isFavoriteByUser(userId: number): Promise<boolean>
}
