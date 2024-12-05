import { LanguageRepository } from '../../../../app/infra/db/protocols/base-repository.js'

export const mockLanguageRepositoryStub = (): LanguageRepository => ({
  findAll: () => Promise.resolve([]),
  findById: () =>
    Promise.resolve({
      id: 0,
      name: 'any_name',
    }),
})
