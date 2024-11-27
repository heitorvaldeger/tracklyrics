import { createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { IVideoDeleteService } from '#services/video/interfaces/IVideoDeleteService'

export const mockVideoDeleteServiceStub = () => {
  class VideoDeleteServiceStub implements IVideoDeleteService {
    delete(_uuid: string): Promise<IMethodResponse<boolean>> {
      return new Promise((resolve) => resolve(createSuccessResponse(true)))
    }
  }

  return new VideoDeleteServiceStub()
}
