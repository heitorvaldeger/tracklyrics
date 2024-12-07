export abstract class FavoriteRepository {
  abstract addFavorite(videoId: number, userId: number, favoriteUuid: string): Promise<boolean>
  abstract removeFavorite(videoId: number, userId: number): Promise<boolean>
  abstract findFavoritesByUser(userId: number): Promise<any[]>
}
