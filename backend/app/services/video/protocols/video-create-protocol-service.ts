import { IMethodResponse } from '#helpers/types/IMethodResponse'

export abstract class VideoCreateProtocolService {
  abstract create(payload: VideoCreateProtocolService.Params): Promise<IMethodResponse<any>>
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
