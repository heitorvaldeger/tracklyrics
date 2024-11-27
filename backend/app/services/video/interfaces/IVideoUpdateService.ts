import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoRequestParams } from '#params/video-params/video-request-params'

export abstract class IVideoUpdateService {
  abstract update(payload: VideoRequestParams, uuid: string): Promise<IMethodResponse<boolean>>
}
