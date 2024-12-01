import { LanguageRepository } from '#repository/protocols/base-repository'

export const mockLanguageRepositoryStub = (): LanguageRepository => ({
  findAll: () => Promise.resolve([]),
  findById: () =>
    Promise.resolve({
      id: 0,
      name: 'any_name',
    }),
})
