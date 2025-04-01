import { VideoSaveResult } from '#models/video-save'

export abstract class IVideoCreateService {
  abstract create(payload: IVideoCreateService.Params): Promise<VideoSaveResult>
}

export namespace IVideoCreateService {
  export type Params = {
    title: string
    artist: string
    releaseYear: string
    linkYoutube: string
    languageId: number
    genreId: number
    isDraft?: boolean
    lyrics?: {
      line: string
      startTime: string
      endTime: string
    }[]
  }
}
