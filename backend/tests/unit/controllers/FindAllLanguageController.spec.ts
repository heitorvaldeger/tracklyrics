import { test } from '@japa/runner'
import { stub } from 'sinon'

import FindAllLanguageController from '#controllers/FindAllLanguageController'
import { ILanguageService } from '#services/interfaces/language-service'

const mockLanguageServiceStub = (): ILanguageService => ({
  findAll: () =>
    Promise.resolve([
      {
        id: 0,
        name: 'any_name',
        flagCountry: 'BR',
      },
    ]),
})

const makeSut = () => {
  const languageServiceStub = mockLanguageServiceStub()
  const sut = new FindAllLanguageController(languageServiceStub)

  return { sut, languageServiceStub }
}
test.group('FindAllLanguageController', () => {
  test('it must returns a list of languages with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const languages = await sut.handle()

    expect(languages).toEqual([
      {
        id: 0,
        name: 'any_name',
        flagCountry: 'BR',
      },
    ])
  })

  test('return 500 if languages find all throws', ({ expect }) => {
    const { sut, languageServiceStub } = makeSut()

    stub(languageServiceStub, 'findAll').throws(new Error())

    const httpResponse = sut.handle()

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
