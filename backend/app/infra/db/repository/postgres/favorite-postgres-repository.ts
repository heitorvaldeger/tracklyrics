import db from '@adonisjs/lucid/services/db'

import { toCamelCase } from '#helpers/to-camel-case'
import FavoriteLucid from '#models/favorite-model/favorite-lucid'

import { FavoriteRepository } from '../protocols/favorite-repository.js'

export class FavoritePostgresRepository implements FavoriteRepository {
  async addFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean> {
    const favorite = await FavoriteLucid.query()
      .where('userId', userId)
      .where('videoId', videoId)
      .first()
    const favoriteAdded = await FavoriteLucid.updateOrCreate(
      {
        videoId,
        userId,
      },
      {
        videoId,
        userId,
        uuid: favorite?.uuid ? favorite.uuid : favoriteUuid,
      }
    )
    return favoriteAdded.$isPersisted
  }

  async removeFavorite(videoId: number, userId: number): Promise<boolean> {
    await FavoriteLucid.query().where('videoId', videoId).where('userId', userId).delete()
    return !(await FavoriteLucid.query().where('videoId', videoId).where('userId', userId).first())
  }

  async findFavoritesByUser(userId: number): Promise<any[]> {
    const favorites = await db
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
        'videos.qty_views',
        'languages.name as language',
        'genres.name as genre',
        'users.username as username'
      )

    return favorites.map((favorite) => toCamelCase(favorite))
  }
}
