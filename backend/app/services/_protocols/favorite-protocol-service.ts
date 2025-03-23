import { VideoMetadata } from '#models/video-metadata'

export abstract class FavoriteProtocolService {
  abstract saveFavorite(videoUuid: string): Promise<boolean>
  abstract removeFavorite(videoUuid: string): Promise<boolean>
  abstract findFavoritesByUserLogged(): Promise<VideoMetadata[]>
}
