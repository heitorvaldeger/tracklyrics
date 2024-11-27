import { IVideoService } from '#services/interfaces/IVideoService'
import _ from 'lodash'
import { createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { VideoRequestParams } from '../../../app/params/video-params/video-request-params.js'
import { VideoFindParams } from '../../../app/params/video-params/video-find-params.js'
import { VideoFindModel } from '#models/video-model/video-find-model'
import { mockFakeVideoModel } from '#tests/factories/fakes/mock-fake-video-model'

export const mockVideoServiceStub = () => {
  class VideoServiceStub implements IVideoService {
    find(_uuid: string): Promise<IMethodResponse<VideoFindModel | null>> {
      return new Promise<IMethodResponse<VideoFindModel | null>>((resolve) =>
        resolve(createSuccessResponse(mockFakeVideoModel()))
      )
    }

    findBy(_filters: Partial<VideoFindParams>): Promise<IMethodResponse<VideoFindModel[]>> {
      return new Promise<IMethodResponse<VideoFindModel[]>>((resolve) =>
        resolve(createSuccessResponse([mockFakeVideoModel()]))
      )
    }

    addFavorite(_videoUuid: string): Promise<IMethodResponse<boolean>> {
      return new Promise((resolve) => resolve(createSuccessResponse(true)))
    }

    removeFavorite(_videoUuid: string): Promise<IMethodResponse<boolean>> {
      return new Promise((resolve) => resolve(createSuccessResponse(true)))
    }
  }

  return new VideoServiceStub()
}
