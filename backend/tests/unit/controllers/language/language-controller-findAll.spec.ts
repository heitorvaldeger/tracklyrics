import LanguageController from '#controllers/language-controller'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import { LanguageProtocolService } from '#services/protocols/language-protocol-service'

const mockLanguageServiceStub = (): LanguageProtocolService => ({
  findAll: () =>
    Promise.resolve([
      {
        id: 0,
        name: 'any_name',
      },
    ]),
})

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
