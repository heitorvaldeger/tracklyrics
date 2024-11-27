import Favorite from '#models/lucid-orm/favorite'
import { IFavoriteRepository } from '#repository/interfaces/IFavoriteRepository'

export class FavoritePostgresRepository implements IFavoriteRepository {
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
