import LanguageController from '#controllers/LanguageController'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import { makeLanguageServiceStub } from '#tests/factories/stubs/makeLanguageServiceStub'

const makeSut = () => {
  const { languageServiceStub, fakeLanguage } = makeLanguageServiceStub()
  const sut = new LanguageController(languageServiceStub)

  return { sut, fakeLanguage }
}
test.group('LanguageController.findAll', () => {
  test('should returns a list of languages with on success', async ({ expect }) => {
    const { sut, fakeLanguage } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(ok([fakeLanguage]))
  })
})
