import { VideoCreateInput, VideoSaveResult, VideoUpdateInput } from '#models/video-save'

export interface VideoResponse {
  linkYoutube: string
  title: string
  artist: string
  releaseYear: string
  uuid: string
  language: string
  genre: string
  username: string
  isFavorite: boolean
}

export abstract class IVideoRepository {
  abstract find(uuid: string): Promise<VideoResponse | null>
  abstract findBy(filters: IVideoRepository.FindVideoParams): Promise<VideoResponse[]>
  abstract getVideoId(videoUuid: string): Promise<number | null>
  abstract getVideoUuidByYoutubeURL(videoUuid: string): Promise<string | undefined>
  abstract getUserId(videoUuid: string): Promise<number | null>
  abstract delete(uuid: string): Promise<boolean>
  abstract create(payload: VideoCreateInput): Promise<VideoSaveResult>
  abstract update(payload: VideoUpdateInput, uuid: string): Promise<boolean>
  abstract hasYoutubeLink(link: string): Promise<boolean>
}

export namespace IVideoRepository {
  export type FindVideoParams = Partial<{
    genreId: number
    languageId: number
    userUuid: string
  }>
}
