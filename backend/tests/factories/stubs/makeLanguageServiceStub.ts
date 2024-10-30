import { ILanguageResponse } from '#interfaces/ILanguageResponse'
import { IGenrerService } from '#services/interfaces/IGenrerService'
import _ from 'lodash'

export const makeLanguageServiceStub = () => {
  const fakeLanguage: ILanguageResponse = {
    id: BigInt(0),
    name: 'any_name',
  }
  class LanguageServiceStub implements IGenrerService {
    async findAll(): Promise<ILanguageResponse[]> {
      return new Promise((resolve) => resolve([fakeLanguage]))
    }
  }

  return {
    languageServiceStub: new LanguageServiceStub(),
    fakeLanguage,
  }
}
