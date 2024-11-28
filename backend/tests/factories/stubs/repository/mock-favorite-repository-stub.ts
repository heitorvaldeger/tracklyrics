import { FavoriteRepository } from '#repository/protocols/favorite-repository'

export const mockFavoriteRepositoryStub = (): FavoriteRepository => ({
  addFavorite: (videoId: number, userId: number) => Promise.resolve(true),
  removeFavorite: (videoId: number, userId: number) => Promise.resolve(true),
})
