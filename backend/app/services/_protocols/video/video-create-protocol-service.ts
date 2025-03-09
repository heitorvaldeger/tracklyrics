import { MethodResponse } from '#helpers/types/method-response'
import { VideoSaveResult } from '#models/video-save'

export abstract class VideoCreateProtocolService {
  abstract create(
    payload: VideoCreateProtocolService.Params
  ): Promise<MethodResponse<VideoSaveResult>>
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
  }
}
