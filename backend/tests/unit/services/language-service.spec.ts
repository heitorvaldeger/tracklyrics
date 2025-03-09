import { test } from '@japa/runner'

import { createSuccessResponse } from '#helpers/method-response'
import { LanguageService } from '#services/language-service'
import { mockLanguageRepositoryStub } from '#tests/__mocks__/stubs/mock-language-stub'

const makeSut = () => {
  const languageRepositoryStub = mockLanguageRepositoryStub()
  const sut = new LanguageService(languageRepositoryStub)

  return { sut, languageRepositoryStub }
}

test.group('LanguageService.findAll', () => {
  test('it must returns a list of languages with on success', async ({ expect }) => {
    const { sut, languageRepositoryStub } = makeSut()

    const languages = await sut.findAll()

    expect(languages).toEqual(createSuccessResponse(languageRepositoryStub.languages))
  })
})
