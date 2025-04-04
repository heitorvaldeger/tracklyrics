import { User } from '#models/user-model/user-lucid'
import { Video } from '#models/video'

import { IFavoriteRepository } from '../interfaces/favorite-repository.js'

export class FavoritePostgresRepository implements IFavoriteRepository {
  async saveFavorite(videoId: number, userId: number, favoriteUuid: string) {
    const video = await Video.find(videoId)

    await video?.load('users', (uq) => {
      uq.where('users.id', userId)
    })

    const hasUser = !!video?.users.length
    if (hasUser) {
      await video?.related('users').sync({
        [userId]: {
          updated_at: new Date().toISOString(),
        },
      })
    } else {
      await video?.related('users').attach({
        [userId]: {
          uuid: favoriteUuid,
          created_at: new Date().toISOString(),
        },
      })
    }

    await video?.load('users', (uq) => {
      uq.where('users.id', userId)
    })

    return !!video?.users.length
  }

  async removeFavorite(videoId: number, userId: number): Promise<boolean> {
    const video = await Video.find(videoId)
    await video?.related('users').detach([userId])

    return !(
      await Video.query()
        .preload('users', (uq) => {
          uq.where('users.id', userId)
        })
        .first()
    )?.users.length
  }

  async findFavoritesByUser(userId: number) {
    const user = await User.query()
      .where('id', userId)
      .preload('videos', (vq) => {
        vq.select(['genreId', 'languageId', '*']).preload('genre').preload('language')
      })
      .first()

    if (user) {
      return user.videos.map((video) => ({
        title: video.title,
        artist: video.artist,
        uuid: video.uuid,
        releaseYear: video.releaseYear,
        linkYoutube: video.linkYoutube,
        language: video.language.name,
        genre: video.genre.name,
        username: user.username,
      }))
    }

    return []
  }

  async isFavoriteByUser(userId: number, videoUuid: string): Promise<boolean> {
    const video = await Video.query()
      .where('uuid', videoUuid)
      .preload('users', (uq) => {
        uq.where('id', userId)
      })
      .first()

    return !!video?.users.length
  }
}
