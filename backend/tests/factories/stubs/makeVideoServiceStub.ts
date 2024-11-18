import { IVideoService } from '#services/interfaces/IVideoService'
import _ from 'lodash'
import { createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/interfaces/IMethodResponse'
import { VideoRequestParams } from '../../../app/params/video/video-request-params.js'
import { VideoFindParams } from '../../../app/params/video/video-find-params.js'
import { VideoFindModel } from '#models/video/video-find-model'
import { makeFakeVideoModel } from '../fakes/makeFakeVideoModel.js'

export const makeVideoServiceStub = () => {
  class VideoServiceStub implements IVideoService {
    find(_uuid: string): Promise<IMethodResponse<VideoFindModel | null>> {
      return new Promise<IMethodResponse<VideoFindModel | null>>((resolve) =>
        resolve(createSuccessResponse(makeFakeVideoModel()))
      )
    }

    findBy(_filters: Partial<VideoFindParams>): Promise<IMethodResponse<VideoFindModel[]>> {
      return new Promise<IMethodResponse<VideoFindModel[]>>((resolve) =>
        resolve(createSuccessResponse([makeFakeVideoModel()]))
      )
    }

    delete(_uuid: string): Promise<IMethodResponse<boolean>> {
      return new Promise((resolve) => resolve(createSuccessResponse(true)))
    }

    create(_payload: VideoRequestParams): Promise<IMethodResponse<any>> {
      return new Promise((resolve) => resolve(createSuccessResponse()))
    }

    update(_payload: VideoRequestParams, _uuid: string): Promise<IMethodResponse<boolean>> {
      return new Promise((resolve) => resolve(createSuccessResponse(true)))
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
