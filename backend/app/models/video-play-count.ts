import { DateTime } from 'luxon'

export interface VideoPlayCount {
  id: number
  videoId: number
  playCount: number
  createdAt: DateTime
  updatedAt: DateTime
}
