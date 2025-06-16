export interface VideoResponse {
  linkYoutube: string
  title: string
  artist: string
  releaseYear: string
  uuid: string
  language: string
  genre: string
  username: string
  isFavorite?: boolean
}

export type VideoSave = {
  title: string
  artist: string
  releaseYear: string
  linkYoutube: string
  languageId: number
  genreId: number
  userId: number
  uuid: string
  isDraft?: boolean
}

export type VideoFindParams = Partial<{
  genreId: number
  languageId: number
  userUuid: string
}>

export abstract class IVideoRepository {
  abstract find(uuid: string): Promise<VideoResponse | null>
  abstract findBy(filters: VideoFindParams): Promise<VideoResponse[]>
  abstract getVideoId(videoUuid: string): Promise<number | null>
  abstract getVideoUuidByYoutubeURL(videoUuid: string): Promise<string | undefined>
  abstract getUserId(videoUuid: string): Promise<number | null>
  abstract delete(uuid: string): Promise<boolean>
  abstract create(payload: VideoSave): Promise<VideoSave>
  abstract update(payload: Omit<VideoSave, 'uuid' | 'linkYoutube'>, uuid: string): Promise<boolean>
  abstract hasYoutubeLink(link: string): Promise<boolean>
}
