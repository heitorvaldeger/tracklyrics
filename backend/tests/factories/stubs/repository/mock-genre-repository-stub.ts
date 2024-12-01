import { GenreRepository } from '#repository/protocols/base-repository'

export const mockGenreRepositoryStub = (): GenreRepository => ({
  findAll: () => Promise.resolve([]),
  findById: () =>
    Promise.resolve({
      id: 0,
      name: 'any_name',
    }),
})
