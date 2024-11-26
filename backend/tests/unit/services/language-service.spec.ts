import { test } from '@japa/runner'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'
import { LanguageFindModel } from '#models/language-model/language-find-model'
import { LanguageService } from '#services/language-service'

const mockLanguageEntityRepositoryStub = () => {
  class LanguageRepositoryStub implements IFindAllRepository<LanguageFindModel> {
    findAll(): Promise<LanguageFindModel[]> {
      return new Promise((resolve) => resolve([]))
    }
  }

  return new LanguageRepositoryStub()
}
const makeSut = () => {
  const fakeLanguageRepositoryStub = mockLanguageEntityRepositoryStub()
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
