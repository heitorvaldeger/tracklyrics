export interface IVideoCreateRequest {
  title: string
  artist: string
  releaseYear: string
  linkYoutube: string
  languageId: number
  genrerId: number
  isDraft?: boolean
}
