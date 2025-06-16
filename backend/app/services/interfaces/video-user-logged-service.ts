import { VideoResponse } from '#core/infra/db/repository/interfaces/video-repository'

export abstract class IVideoUserLoggedService {
  abstract isNotVideoOwnedByUserLogged(videoUuid: string): Promise<boolean>
  abstract getVideosByUserLogged(): Promise<VideoResponse[]>
}
