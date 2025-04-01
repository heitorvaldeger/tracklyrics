import { VideoMetadata } from '#models/video-metadata'

export abstract class IFavoriteService {
  abstract saveFavorite(videoUuid: string): Promise<boolean>
  abstract removeFavorite(videoUuid: string): Promise<boolean>
  abstract findFavoritesByUserLogged(): Promise<VideoMetadata[]>
}
