import { test } from '@japa/runner'
import { LanguageService } from '#services/language-service'
import { mockLanguageRepositoryStub } from '#tests/factories/stubs/repository/mock-language-repository-stub'

const makeSut = () => {
  const fakeLanguageRepositoryStub = mockLanguageRepositoryStub()
  const sut = new LanguageService(fakeLanguageRepositoryStub)

  return { sut }
}

test.group('LanguageService.findAll', () => {
  test('should returns a list of languages with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const languages = await sut.findAll()

    expect(languages).toEqual([])
  })
})
