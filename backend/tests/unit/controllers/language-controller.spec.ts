import { test } from '@japa/runner'
import { stub } from 'sinon'

import LanguageController from '#controllers/language-controller'
import { ok, serverError } from '#helpers/http'
import { createSuccessResponse } from '#helpers/method-response'
import { LanguageProtocolService } from '#services/_protocols/language-protocol-service'

const mockLanguageServiceStub = (): LanguageProtocolService => ({
  findAll: () =>
    Promise.resolve(
      createSuccessResponse([
        {
          id: 0,
          name: 'any_name',
          flagCountry: 'BR',
        },
      ])
    ),
})

const makeSut = () => {
  const languageServiceStub = mockLanguageServiceStub()
  const sut = new LanguageController(languageServiceStub)

  return { sut, languageServiceStub }
}
test.group('LanguageController', () => {
  test('it must returns a list of languages with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(
      ok([
        {
          id: 0,
          name: 'any_name',
          flagCountry: 'BR',
        },
      ])
    )
  })

  test('return 500 if languages find all throws', async ({ expect }) => {
    const { sut, languageServiceStub } = makeSut()

    stub(languageServiceStub, 'findAll').throws(new Error())

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
