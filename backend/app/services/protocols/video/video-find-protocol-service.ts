import { MethodResponse } from '#helpers/types/method-response'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { VideoFindModel } from '#models/video-model/video-find-model'

export abstract class VideoFindProtocolService {
  abstract find(uuid: string): Promise<MethodResponse<VideoFindModel | null>>
  abstract findBy(
    filters: VideoFindProtocolService.FindVideoParams
  ): Promise<MethodResponse<VideoFindModel[]>>
}

export namespace VideoFindProtocolService {
  export type FindVideoParams = VideoRepository.FindVideoParams
}
