import { IFavoriteRepository } from '#repository/interfaces/IFavoriteRepository'

export const mockFavoriteRepositoryStub = () => {
  class FavoriteRepositoryStub implements IFavoriteRepository {
    addFavorite(videoId: number, userId: number): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
    removeFavorite(videoId: number, userId: number): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
  }

  return new FavoriteRepositoryStub()
}
