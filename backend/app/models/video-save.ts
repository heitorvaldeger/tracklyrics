export type VideoSaveResult = {
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

export interface VideoCreateInput extends VideoSaveResult {}
export interface VideoUpdateInput extends Partial<VideoSaveResult> {}
