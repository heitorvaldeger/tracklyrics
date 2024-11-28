import Favorite from '#models/lucid-orm/favorite'
import { FavoriteRepository } from '#repository/protocols/favorite-repository'

export class FavoritePostgresRepository implements FavoriteRepository {
  async addFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean> {
    const favoriteAdded = await Favorite.create({
      videoId,
      userId,
      uuid: favoriteUuid,
    })
    return favoriteAdded.$isPersisted
  }

  async removeFavorite(videoId: number, userId: number): Promise<boolean> {
    await Favorite.query().where('videoId', videoId).where('userId', userId).delete()
    return !(await Favorite.query().where('videoId', videoId).where('userId', userId).first())
  }
}
