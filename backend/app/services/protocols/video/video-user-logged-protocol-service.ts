import { MethodResponse } from '#helpers/types/method-response'
import { VideoFindModel } from '#models/video-model/video-find-model'

export abstract class VideoUserLoggedProtocolService {
  abstract isNotVideoOwnedByUserLogged(videoUuid: string): Promise<boolean>
  abstract getVideosByUserLogged(): Promise<MethodResponse<VideoFindModel[]>>
}
