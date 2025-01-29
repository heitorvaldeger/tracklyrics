import { test } from '@japa/runner'

import { LanguageService } from '#services/language-service'
import { mockLanguageRepositoryStub } from '#tests/__mocks__/stubs/mock-language-stub'

const makeSut = () => {
  const fakeLanguageRepositoryStub = mockLanguageRepositoryStub()
  const sut = new LanguageService(fakeLanguageRepositoryStub)

  return { sut }
}

test.group('LanguageService.findAll', () => {
  test('it must returns a list of languages with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const languages = await sut.findAll()

    expect(languages).toEqual([])
  })
})
