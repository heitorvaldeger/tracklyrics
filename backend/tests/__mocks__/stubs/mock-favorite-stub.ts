import { FavoriteRepository } from '#infra/db/repository/_protocols/favorite-repository'
import { FavoriteProtocolService } from '#services/_protocols/favorite-protocol-service'
import { mockVideoData } from '#tests/__mocks__/stubs/mock-video-stub'

export const mockFavoriteRepositoryStub = (): FavoriteRepository => ({
  saveFavorite: (_: number, __: number) => Promise.resolve(true),
  removeFavorite: (_: number, __: number) => Promise.resolve(true),
  findFavoritesByUser: (__: number) => Promise.resolve([mockVideoData, mockVideoData]),
})

export const mockFavoriteServiceStub = (): FavoriteProtocolService => ({
  saveFavorite: (_: string) => Promise.resolve(true),
  removeFavorite: (_: string) => Promise.resolve(true),
  findFavoritesByUserLogged: () => Promise.resolve([mockVideoData, mockVideoData]),
})
