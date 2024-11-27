import { VideoFindParams } from '#params/video-params/video-find-params'
import { VideoFindModel } from '#models/video-model/video-find-model'
import { VideoSaveParams } from '#params/video-params/video-save-params'
import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { mockFakeVideoModel, mockFakeVideoSaveResultModel } from '#tests/factories/fakes/index'

export const mockVideoRepositoryStub = () => {
  class VideoRepositoryStub implements IVideoRepository {
    find(_uuid: string): Promise<VideoFindModel | null> {
      return new Promise((resolve) => resolve(mockFakeVideoModel()))
    }
    findBy(_filters: Partial<VideoFindParams>): Promise<VideoFindModel[]> {
      return new Promise((resolve) => resolve([]))
    }
    getVideoId(videoUuid: string): Promise<number> {
      return new Promise((resolve) => resolve(1))
    }
    getUserId(videoUuid: string): Promise<number> {
      return new Promise((resolve) => resolve(0))
    }
    delete(_uuid: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
    create(_payload: VideoSaveParams): Promise<VideoSaveResultModel> {
      return new Promise((resolve) => resolve(mockFakeVideoSaveResultModel()))
    }
    update(_payload: VideoSaveParams, _uuid: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
    hasYoutubeLink(_link: string): Promise<boolean> {
      return new Promise((resolve) => resolve(false))
    }
  }

  return new VideoRepositoryStub()
}
