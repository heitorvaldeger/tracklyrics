import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoRequestParams } from '#params/video-params/video-request-params'

export abstract class IVideoCreateService {
  abstract create(payload: VideoRequestParams): Promise<IMethodResponse<any>>
}
