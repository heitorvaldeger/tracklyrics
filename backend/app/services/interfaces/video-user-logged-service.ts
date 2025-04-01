import { VideoMetadata } from '#models/video-metadata'

export abstract class IVideoUserLoggedService {
  abstract isNotVideoOwnedByUserLogged(videoUuid: string): Promise<boolean>
  abstract getVideosByUserLogged(): Promise<VideoMetadata[]>
}
