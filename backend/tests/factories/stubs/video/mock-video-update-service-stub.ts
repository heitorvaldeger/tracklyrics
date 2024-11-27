import _ from 'lodash'
import { createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoRequestParams } from '#params/video-params/video-request-params'
import { IVideoUpdateService } from '#services/video/interfaces/IVideoUpdateService'

export const mockVideoUpdateServiceStub = () => {
  class VideoUpdateServiceStub implements IVideoUpdateService {
    update(_payload: VideoRequestParams, _uuid: string): Promise<IMethodResponse<boolean>> {
      return new Promise((resolve) => resolve(createSuccessResponse(true)))
    }
  }

  return new VideoUpdateServiceStub()
}
