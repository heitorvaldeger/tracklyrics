import { mockFakeFavoriteModel } from '#tests/factories/fakes/mock-fake-video-model'

import { FavoriteRepository } from '../../../../app/infra/db/protocols/favorite-repository.js'

export const mockFavoriteRepositoryStub = (): FavoriteRepository => ({
  addFavorite: (videoId: number, userId: number) => Promise.resolve(true),
  removeFavorite: (videoId: number, userId: number) => Promise.resolve(true),
  findFavoritesByUser: (userId: number) =>
    Promise.resolve([mockFakeFavoriteModel(), mockFakeFavoriteModel()]),
})
