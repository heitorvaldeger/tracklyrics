import { MethodResponse } from '#helpers/types/method-response'
import { VideoSaveResultModel } from '#models/video-model/video-save-result-model'

export abstract class VideoCreateProtocolService {
  abstract create(
    payload: VideoCreateProtocolService.Params
  ): Promise<MethodResponse<VideoSaveResultModel>>
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
