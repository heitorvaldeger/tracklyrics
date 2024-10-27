import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IVideoService } from '#services/interfaces/IVideoService'
import _ from 'lodash'
import { FakeVideoFactory } from './makeFakeVideo.js'

export const makeFakeVideoServiceStub = (fakeVideo?: FakeVideoFactory) => {
  class VideoServiceStub implements IVideoService {
    find(uuid: string): Promise<IVideoResponse | null> {
      return new Promise<IVideoResponse | null>((resolve) => resolve(fakeVideo ?? null))
    }

    findAll(): Promise<IVideoResponse[]> {
      return new Promise((resolve) => resolve(fakeVideo ? [fakeVideo] : []))
    }

    findByGenrer(genrerId: number): Promise<IVideoResponse[]> {
      return new Promise((resolve) => resolve(fakeVideo ? [fakeVideo] : []))
    }

    findByLanguage(languageId: number): Promise<IVideoResponse[]> {
      return new Promise((resolve) => resolve(fakeVideo ? [fakeVideo] : []))
    }
  }

  return new VideoServiceStub()
}
