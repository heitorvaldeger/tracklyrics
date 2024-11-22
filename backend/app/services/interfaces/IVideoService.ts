import { ApplicationError } from '#helpers/types/ApplicationError'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoFindParams } from '../../params/video-params/video-find-params.js'
import { VideoRequestParams } from '../../params/video-params/video-request-params.js'
import { VideoFindModel } from '#models/video-model/video-find-model'

export abstract class IVideoService {
  abstract find(uuid: string): Promise<IMethodResponse<VideoFindModel | null>>
  abstract findBy(filters: Partial<VideoFindParams>): Promise<IMethodResponse<VideoFindModel[]>>
  abstract delete(uuid: string): Promise<IMethodResponse<boolean>>
  abstract create(payload: VideoRequestParams): Promise<IMethodResponse<any>>
  abstract update(payload: VideoRequestParams, uuid: string): Promise<IMethodResponse<boolean>>
  abstract addFavorite(videoUuid: string): Promise<IMethodResponse<boolean | ApplicationError>>
  abstract removeFavorite(videoUuid: string): Promise<IMethodResponse<boolean>>
}
