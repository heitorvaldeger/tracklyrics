import { IFavoriteRepository } from '#core/infra/db/repository/interfaces/favorite-repository'
import { IFavoriteService } from '#services/interfaces/favorite-service'
import { mockVideoData } from '#tests/__mocks__/stubs/mock-video-stub'

export const mockFavoriteRepository: IFavoriteRepository = {
  saveFavorite: (_: number, __: number) => Promise.resolve(true),
  removeFavorite: (_: number, __: number) => Promise.resolve(true),
  findFavoritesByUser: (_: number) => Promise.resolve([mockVideoData, mockVideoData]),
  isFavoriteByUser: (_: number) => Promise.resolve(true),
}

export const mockFavoriteService: IFavoriteService = {
  saveFavorite: (_: string) => Promise.resolve(true),
  removeFavorite: (_: string) => Promise.resolve(true),
  findFavoritesByUserLogged: () => Promise.resolve([mockVideoData, mockVideoData]),
}
