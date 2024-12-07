import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoRepository } from '#infra/db/repository/protocols/video-repository'
import { VideoFindModel } from '#models/video-model/video-find-model'

export abstract class VideoFindProtocolService {
  abstract find(uuid: string): Promise<IMethodResponse<VideoFindModel | null>>
  abstract findBy(
    filters: VideoFindProtocolService.FindVideoParams
  ): Promise<IMethodResponse<VideoFindModel[]>>
}

export namespace VideoFindProtocolService {
  export type FindVideoParams = VideoRepository.FindVideoParams
}
