import db from '@adonisjs/lucid/services/db'

import { toCamelCase } from '#helpers/to-camel-case'
import { toSnakeCase } from '#helpers/to-snake-case'
import { VideoFindModel } from '#models/video-model/video-find-model'

import { FavoriteRepository } from '../protocols/favorite-repository.js'

export class FavoritePostgresRepository implements FavoriteRepository {
  async addFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean> {
    const favoriteQuery = db.from('favorites').where('user_id', userId).where('video_id', videoId)

    const hasFavorite = !!(await favoriteQuery.first())

    const favoritesUpdatedOrInserted = hasFavorite
      ? await db
          .from('favorites')
          .where('user_id', userId)
          .where('video_id', videoId)
          .returning('uuid')
          .update(
            toSnakeCase({
              videoId,
              userId,
              updatedAt: new Date().toISOString(),
            })
          )
      : await db
          .table('favorites')
          .returning('uuid')
          .insert(
            toSnakeCase({
              videoId,
              userId,
              uuid: favoriteUuid,
              createdAt: new Date().toISOString(),
            })
          )

    return !!favoritesUpdatedOrInserted.length
  }

  async removeFavorite(videoId: number, userId: number): Promise<boolean> {
    await db.from('favorites').where('video_id', videoId).where('user_id', userId).delete()
    return !(await db.from('favorites').where('video_id', videoId).where('user_id', userId).first())
  }

  async findFavoritesByUser(userId: number): Promise<VideoFindModel[]> {
    const favorites: VideoFindModel[] = await db
      .from('favorites')
      .where('favorites.user_id', userId)
      .innerJoin('videos', 'videos.id', 'favorites.video_id')
      .innerJoin('users', 'users.id', 'favorites.user_id')
      .innerJoin('languages', 'languages.id', 'videos.language_id')
      .innerJoin('genres', 'genres.id', 'videos.genre_id')
      .select(
        'videos.title',
        'videos.artist',
        'videos.uuid',
        'videos.release_year',
        'videos.link_youtube',
        'languages.name as language',
        'genres.name as genre',
        'users.username as username'
      )

    return favorites.map((favorite) => toCamelCase(favorite))
  }
}
