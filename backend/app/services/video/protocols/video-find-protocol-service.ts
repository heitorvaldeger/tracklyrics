import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoFindModel } from '#models/video-model/video-find-model'

import { VideoRepository } from '../../../infra/db/protocols/video-repository.js'

export abstract class VideoFindProtocolService {
  abstract find(uuid: string): Promise<IMethodResponse<VideoFindModel | null>>
  abstract findBy(
    filters: VideoFindProtocolService.FindVideoParams
  ): Promise<IMethodResponse<VideoFindModel[]>>
}

export namespace VideoFindProtocolService {
  export type FindVideoParams = VideoRepository.FindVideoParams
}
