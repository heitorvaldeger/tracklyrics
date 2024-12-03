import { toCamelCase } from '#helpers/to-camel-case'
import Favorite from '#models/lucid-orm/favorite'
import { FavoriteRepository } from '#repository/protocols/favorite-repository'
import db from '@adonisjs/lucid/services/db'

export class FavoritePostgresRepository implements FavoriteRepository {
  async addFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean> {
    const favorite = await Favorite.query()
      .where('userId', userId)
      .where('videoId', videoId)
      .first()
    const favoriteAdded = await Favorite.updateOrCreate(
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
    await Favorite.query().where('videoId', videoId).where('userId', userId).delete()
    return !(await Favorite.query().where('videoId', videoId).where('userId', userId).first())
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
