import { DateTime } from 'luxon'

import { VideoResponse } from './video-repository.js'

export interface Favorite {
  id: number
  uuid: string
  createdAt: DateTime
  updatedAt: DateTime
  videoId: number
  userId: number
}

export abstract class IFavoriteRepository {
  abstract saveFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean>
  abstract removeFavorite(videoId: number, userId: number): Promise<boolean>
  abstract findFavoritesByUser(userId: number): Promise<VideoResponse[]>
  abstract isFavoriteByUser(userId: number, videoUuid: string): Promise<boolean>
}
