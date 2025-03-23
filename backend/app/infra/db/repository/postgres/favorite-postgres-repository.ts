import db from '@adonisjs/lucid/services/db'

import { VideoMetadata } from '#models/video-metadata'
import { toSnakeCase } from '#utils/index'
import { toCamelCase } from '#utils/index'

import { FavoriteRepository } from '../_protocols/favorite-repository.js'

export class FavoritePostgresRepository implements FavoriteRepository {
  async saveFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean> {
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

  async findFavoritesByUser(userId: number): Promise<VideoMetadata[]> {
    const favorites: VideoMetadata[] = await db
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
