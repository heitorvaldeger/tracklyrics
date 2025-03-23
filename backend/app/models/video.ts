import { DateTime } from 'luxon'

export interface Video {
  id: number
  isDraft: boolean
  title: string
  artist: string
  releaseYear: string
  linkYoutube: string
  uuid: string
  languageId: number
  genreId: number
  userId: number
}
