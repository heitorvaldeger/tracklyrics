import { IApplicationError } from '#helpers/interfaces/IApplicationError'
import { IMethodResponse } from '#helpers/interfaces/IMethodResponse'
import { VideoFindParams } from '../../params/video/video-find-params.js'
import { VideoRequestParams } from '../../params/video/video-request-params.js'
import { VideoFindModel } from '#models/video/video-find-model'

export abstract class IVideoService {
  abstract find(uuid: string): Promise<IMethodResponse<VideoFindModel | null>>
  abstract findBy(filters: Partial<VideoFindParams>): Promise<IMethodResponse<VideoFindModel[]>>
  abstract delete(uuid: string): Promise<IMethodResponse<boolean>>
  abstract create(payload: VideoRequestParams): Promise<IMethodResponse<any>>
  abstract update(payload: VideoRequestParams, uuid: string): Promise<IMethodResponse<boolean>>
  abstract addFavorite(videoUuid: string): Promise<IMethodResponse<boolean | IApplicationError>>
  abstract removeFavorite(videoUuid: string): Promise<IMethodResponse<boolean>>
}
