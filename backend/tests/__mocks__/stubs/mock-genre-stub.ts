import { IGenreRepository } from '#infra/db/repository/interfaces/genre-repository'

export const mockGenreRepository: IGenreRepository = {
  findAll: () => Promise.resolve([]),
  findById: () =>
    Promise.resolve({
      id: 0,
      name: 'any_name',
    }),
}
