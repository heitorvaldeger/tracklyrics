import { MethodResponse } from '#helpers/types/method-response'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { VideoListFindModel } from '#models/video-model/video-list-find-model'

export abstract class VideoFindProtocolService {
  abstract find(uuid: string): Promise<MethodResponse<VideoListFindModel | null>>
  abstract findBy(
    filters: VideoFindProtocolService.FindVideoParams
  ): Promise<MethodResponse<VideoListFindModel[]>>
}

export namespace VideoFindProtocolService {
  export type FindVideoParams = VideoRepository.FindVideoParams
}
