import { IVideoResponse } from '#interfaces/IVideoResponse'
import Genrer from '#models/genrer'
import Language from '#models/language'
import Video from '#models/video'
import { IVideoService } from '#services/interfaces/IVideoService'
import _ from 'lodash'

export const makeFakeVideoServiceStub = (
  fakeVideo?: Video,
  language?: Language,
  genrer?: Genrer
) => {
  const videoStub = {
    ..._.omit(fakeVideo, 'languageId', 'genrerId'),
    language: language?.name || '',
    genrer: genrer?.name || '',
  }

  class VideoServiceStub implements IVideoService {
    find(uuid: string): Promise<IVideoResponse | null> {
      return new Promise<IVideoResponse>((resolve) => resolve(videoStub))
    }

    findAll(): Promise<IVideoResponse[]> {
      return new Promise((resolve) => resolve([videoStub]))
    }

    findByGenrer(genrerId: number): Promise<IVideoResponse[]> {
      return new Promise((resolve) => resolve([videoStub]))
    }

    findByLanguage(languageId: number): Promise<IVideoResponse[]> {
      return new Promise((resolve) => resolve([videoStub]))
    }
  }

  return {
    videoServiceStub: new VideoServiceStub(),
    videoStub,
  }
}
