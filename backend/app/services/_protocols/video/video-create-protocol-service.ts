import { VideoSaveResult } from '#models/video-save'

export abstract class VideoCreateProtocolService {
  abstract create(payload: VideoCreateProtocolService.Params): Promise<VideoSaveResult>
}

export namespace VideoCreateProtocolService {
  export type Params = {
    title: string
    artist: string
    releaseYear: string
    linkYoutube: string
    languageId: number
    genreId: number
    isDraft?: boolean
    lyrics: {
      line: string
      startTime: string
      endTime: string
    }[]
  }
}
