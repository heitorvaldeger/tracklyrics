import { GenreRepository } from '#infra/db/repository/protocols/genre-repository'

export const mockGenreRepositoryStub = (): GenreRepository => ({
  findAll: () => Promise.resolve([]),
  findById: () =>
    Promise.resolve({
      id: 0,
      name: 'any_name',
    }),
})
