import { FavoriteRepository } from '#infra/db/repository/protocols/favorite-repository'
import { mockVideoModel } from '#tests/factories/mocks/mock-video-model'

export const mockFavoriteRepositoryStub = (): FavoriteRepository => ({
  addFavorite: (videoId: number, userId: number) => Promise.resolve(true),
  removeFavorite: (videoId: number, userId: number) => Promise.resolve(true),
  findFavoritesByUser: (userId: number) => Promise.resolve([mockVideoModel(), mockVideoModel()]),
})
