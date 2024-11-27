import _ from 'lodash'
import { createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { IVideoFavoriteService } from '#services/video/interfaces/IVideoFavoriteService'

export const mockVideoFavoriteServiceStub = () => {
  class VideoFavoriteServiceStub implements IVideoFavoriteService {
    addFavorite(_videoUuid: string): Promise<IMethodResponse<boolean>> {
      return new Promise((resolve) => resolve(createSuccessResponse(true)))
    }

    removeFavorite(_videoUuid: string): Promise<IMethodResponse<boolean>> {
      return new Promise((resolve) => resolve(createSuccessResponse(true)))
    }
  }

  return new VideoFavoriteServiceStub()
}
