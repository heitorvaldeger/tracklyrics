import { LanguageRepository } from '#infra/db/repository/_protocols/language-repository'
import { Language } from '#models/language'

interface MockLanguageRepositoryStub extends LanguageRepository {
  languages: Language[]
  language: Language
}
export const mockLanguageRepository: MockLanguageRepositoryStub = {
  language: {
    id: 0,
    name: 'any_name',
    flagCountry: 'BR',
  },
  languages: [
    {
      id: 0,
      name: 'any_name',
      flagCountry: 'BR',
    },
    {
      id: 1,
      name: 'any_name',
      flagCountry: 'EN',
    },
  ],
  findAll: function () {
    return Promise.resolve(this.languages)
  },
  findById: function () {
    return Promise.resolve(this.language)
  },
}
