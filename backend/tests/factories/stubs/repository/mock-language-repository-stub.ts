import { LanguageRepository } from '#infra/db/repository/protocols/language-repository'

export const mockLanguageRepositoryStub = (): LanguageRepository => ({
  findAll: () => Promise.resolve([]),
  findById: () =>
    Promise.resolve({
      id: 0,
      name: 'any_name',
    }),
})
