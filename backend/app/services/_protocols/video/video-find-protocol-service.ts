import { MethodResponse } from '#helpers/types/method-response'
import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoMetadata } from '#models/video-metadata'

export abstract class VideoFindProtocolService {
  abstract find(uuid: string): Promise<MethodResponse<VideoMetadata | null>>
  abstract findBy(
    filters: VideoFindProtocolService.FindVideoParams
  ): Promise<MethodResponse<VideoMetadata[]>>
}

export namespace VideoFindProtocolService {
  export type FindVideoParams = VideoRepository.FindVideoParams
}
