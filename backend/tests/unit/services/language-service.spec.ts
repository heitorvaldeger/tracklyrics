import { test } from '@japa/runner'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'
import { ILanguageResponse } from '#interfaces/ILanguageResponse'
import { LanguageService } from '#services/LanguageService'

const makeFakeLanguageRepositoryStub = () => {
  class LanguageRepositoryStub implements IFindAllRepository {
    findAll(): Promise<ILanguageResponse[]> {
      return new Promise((resolve) => resolve([]))
    }
  }

  return new LanguageRepositoryStub()
}
const makeSut = () => {
  const fakeLanguageRepositoryStub = makeFakeLanguageRepositoryStub()
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
