import { test } from '@japa/runner'

import { LanguageService } from '#services/language-service'
import { mockLanguageRepository } from '#tests/__mocks__/stubs/mock-language-stub'

const makeSut = () => {
  const sut = new LanguageService(mockLanguageRepository)

  return { sut }
}

test.group('LanguageService.findAll', () => {
  test('it must returns a list of languages with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const languages = await sut.findAll()

    expect(languages).toEqual(mockLanguageRepository.languages)
  })
})
