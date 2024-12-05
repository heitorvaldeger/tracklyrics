import { GenreRepository } from '../../../../app/infra/db/protocols/base-repository.js'

export const mockGenreRepositoryStub = (): GenreRepository => ({
  findAll: () => Promise.resolve([]),
  findById: () =>
    Promise.resolve({
      id: 0,
      name: 'any_name',
    }),
})
