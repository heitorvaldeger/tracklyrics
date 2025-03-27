import { VideoRepository } from '#infra/db/repository/_protocols/video-repository'
import { VideoMetadata } from '#models/video-metadata'

export abstract class VideoFindProtocolService {
  abstract find(uuid: string): Promise<VideoMetadata | null>
  abstract findBy(filters: VideoFindProtocolService.FindVideoParams): Promise<VideoMetadata[]>
}

export namespace VideoFindProtocolService {
  export type FindVideoParams = VideoRepository.FindVideoParams
}
