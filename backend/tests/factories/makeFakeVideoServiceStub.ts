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
  class VideoServiceStub implements IVideoService {
    find(uuid: string): Promise<IVideoResponse | null> {
      return new Promise<IVideoResponse>((resolve) =>
        resolve({
          ..._.omit(fakeVideo, 'languageId', 'genrerId'),
          language: language?.name || '',
          genrer: genrer?.name || '',
        })
      )
    }

    findAll(): Promise<IVideoResponse[]> {
      return new Promise((resolve) =>
        resolve([
          {
            ..._.omit(fakeVideo, 'languageId', 'genrerId'),
            language: language?.name || '',
            genrer: genrer?.name || '',
          },
        ])
      )
    }
  }

  return new VideoServiceStub()
}
