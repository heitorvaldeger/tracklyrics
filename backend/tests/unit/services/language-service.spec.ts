import { test } from '@japa/runner'
import { LanguageRepository } from '#repository/protocols/base-repository'
import { LanguageService } from '#services/language-service'

const mockLanguageRepositoryStub = (): LanguageRepository => ({
  findAll: () => Promise.resolve([]),
})

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
