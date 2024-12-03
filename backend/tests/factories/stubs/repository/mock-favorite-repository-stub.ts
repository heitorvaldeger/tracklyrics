import { FavoriteRepository } from '#repository/protocols/favorite-repository'
import { mockFakeFavoriteModel } from '#tests/factories/fakes/mock-fake-video-model'

export const mockFavoriteRepositoryStub = (): FavoriteRepository => ({
  addFavorite: (videoId: number, userId: number) => Promise.resolve(true),
  removeFavorite: (videoId: number, userId: number) => Promise.resolve(true),
  findFavoritesByUser: (userId: number) =>
    Promise.resolve([mockFakeFavoriteModel(), mockFakeFavoriteModel()]),
})
