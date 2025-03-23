import { VideoMetadata } from '#models/video-metadata'

export abstract class VideoUserLoggedProtocolService {
  abstract isNotVideoOwnedByUserLogged(videoUuid: string): Promise<boolean>
  abstract getVideosByUserLogged(): Promise<VideoMetadata[]>
}
