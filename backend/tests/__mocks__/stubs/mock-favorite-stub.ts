import { createSuccessResponse } from '#helpers/method-response'
import { FavoriteRepository } from '#infra/db/repository/_protocols/favorite-repository'
import { FavoriteProtocolService } from '#services/_protocols/favorite-protocol-service'
import { mockVideoData } from '#tests/__mocks__/stubs/mock-video-stub'

export const mockFavoriteRepositoryStub = (): FavoriteRepository => ({
  addFavorite: (videoId: number, userId: number) => Promise.resolve(true),
  removeFavorite: (videoId: number, userId: number) => Promise.resolve(true),
  findFavoritesByUser: (userId: number) => Promise.resolve([mockVideoData, mockVideoData]),
})

export const mockFavoriteServiceStub = (): FavoriteProtocolService => ({
  addFavorite: (videoUuid: string) => Promise.resolve(createSuccessResponse(true)),
  removeFavorite: (videoUuid: string) => Promise.resolve(createSuccessResponse(true)),
  findFavoritesByUserLogged: () =>
    Promise.resolve(createSuccessResponse([mockVideoData, mockVideoData])),
})
