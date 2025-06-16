import {
  ILanguageRepository,
  LanguageResponse,
} from '#infra/db/repository/interfaces/language-repository'

interface MockLanguageRepositoryStub extends ILanguageRepository {
  languages: LanguageResponse[]
  language: LanguageResponse
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
