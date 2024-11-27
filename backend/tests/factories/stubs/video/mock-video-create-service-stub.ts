import _ from 'lodash'
import { createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoRequestParams } from '#params/video-params/video-request-params'
import { IVideoCreateService } from '#services/video/interfaces/IVideoCreateService'

export const mockVideoCreateServiceStub = () => {
  class VideoCreateServiceStub implements IVideoCreateService {
    create(_payload: VideoRequestParams): Promise<IMethodResponse<any>> {
      return new Promise((resolve) => resolve(createSuccessResponse()))
    }
  }

  return new VideoCreateServiceStub()
}
