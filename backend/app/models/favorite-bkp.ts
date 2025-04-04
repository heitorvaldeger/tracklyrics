import { DateTime } from 'luxon'

export interface Favorite {
  id: number
  uuid: string
  createdAt: DateTime
  updatedAt: DateTime
  videoId: number
  userId: number
}
