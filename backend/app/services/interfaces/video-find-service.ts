import { VideoFindParams, VideoResponse } from '#infra/db/repository/interfaces/video-repository'

export abstract class IVideoFindService {
  abstract find(uuid: string): Promise<VideoResponse | null>
  abstract findBy(filters: VideoFindParams): Promise<VideoResponse[]>
}
