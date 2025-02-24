import { LanguageRepository } from '#infra/db/repository/protocols/language-repository'
import { LanguageFindModel } from '#models/language-model/language-find-model'

interface MockLanguageRepositoryStub extends LanguageRepository {
  languages: LanguageFindModel[]
  language: LanguageFindModel
}
export const mockLanguageRepositoryStub = (): MockLanguageRepositoryStub => ({
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
})
