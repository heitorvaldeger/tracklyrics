import { IVideoRepository } from '#infra/db/repository/interfaces/video-repository'
import { VideoMetadata } from '#models/video-metadata'

export abstract class IVideoFindService {
  abstract find(uuid: string): Promise<VideoMetadata | null>
  abstract findBy(filters: IVideoFindService.FindVideoParams): Promise<VideoMetadata[]>
}

export namespace IVideoFindService {
  export type FindVideoParams = IVideoRepository.FindVideoParams
}
