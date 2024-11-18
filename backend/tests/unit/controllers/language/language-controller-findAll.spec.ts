import LanguageController from '#controllers/language-controller'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import { LanguageFindModel } from '#models/language/language-find-model'
import { IGenrerService } from '#services/interfaces/IGenrerService'

const makeFakeLanguage = () => [
  {
    id: 0,
    name: 'any_name',
  },
]
const makeLanguageServiceStub = () => {
  class LanguageServiceStub implements IGenrerService {
    async findAll(): Promise<LanguageFindModel[]> {
      return new Promise((resolve) => resolve(makeFakeLanguage()))
    }
  }

  return new LanguageServiceStub()
}

const makeSut = () => {
  const languageServiceStub = makeLanguageServiceStub()
  const sut = new LanguageController(languageServiceStub)

  return { sut }
}
test.group('LanguageController.findAll', () => {
  test('should returns a list of languages with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(ok(makeFakeLanguage()))
  })
})
