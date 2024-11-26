import LanguageController from '#controllers/language-controller'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import { LanguageFindModel } from '#models/language-model/language-find-model'
import { ILanguageService } from '#services/interfaces/ILanguageService'

const mockLanguageServiceStub = () => {
  class LanguageServiceStub implements ILanguageService {
    async findAll(): Promise<LanguageFindModel[]> {
      return new Promise((resolve) =>
        resolve([
          {
            id: 0,
            name: 'any_name',
          },
        ])
      )
    }
  }

  return new LanguageServiceStub()
}

const makeSut = () => {
  const languageServiceStub = mockLanguageServiceStub()
  const sut = new LanguageController(languageServiceStub)

  return { sut }
}
test.group('LanguageController.findAll', () => {
  test('should returns a list of languages with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(
      ok([
        {
          id: 0,
          name: 'any_name',
        },
      ])
    )
  })
})
