import { VideoFindParams } from '../../../app/params/video/video-find-params.js'
import { VideoFindModel } from '#models/video/video-find-model'
import { VideoSaveParams } from '../../../app/params/video/video-save-params.js'
import { VideoSaveResultModel } from '#models/video/video-save-result-model'
import { IVideoRepository } from '#repository/interfaces/IVideoRepository'
import { makeFakeVideoModel } from '#tests/factories/fakes/index'
import { makeFakeVideoSaveResultModel } from '../fakes/makeFakeVideoSaveResultModel.js'

export const makeVideoRepositoryStub = () => {
  class VideoRepositoryStub implements IVideoRepository {
    addFavorite(videoId: number, userId: number): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
    removeFavorite(videoId: number, userId: number): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
    find(_uuid: string): Promise<VideoFindModel | null> {
      return new Promise((resolve) => resolve(makeFakeVideoModel()))
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
      return new Promise((resolve) => resolve(makeFakeVideoSaveResultModel()))
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
