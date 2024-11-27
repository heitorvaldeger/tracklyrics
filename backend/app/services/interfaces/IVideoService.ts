import { ApplicationError } from '#helpers/types/ApplicationError'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoFindModel } from '#models/video-model/video-find-model'
import { VideoFindParams } from '#params/video-params/video-find-params'

export abstract class IVideoService {
  abstract find(uuid: string): Promise<IMethodResponse<VideoFindModel | null>>
  abstract findBy(filters: Partial<VideoFindParams>): Promise<IMethodResponse<VideoFindModel[]>>
}
