import { test } from '@japa/runner'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'
import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { GenreService } from '#services/genre-service'

const mockGenreEntityRepositoryStub = () => {
  class GenreRepositoryStub implements IFindAllRepository<GenreFindModel> {
    findAll(): Promise<GenreFindModel[]> {
      return new Promise((resolve) => resolve([]))
    }
  }

  return new GenreRepositoryStub()
}
const makeSut = () => {
  const fakeGenreRepositoryStub = mockGenreEntityRepositoryStub()
  const sut = new GenreService(fakeGenreRepositoryStub)

  return { sut }
}

test.group('GenreService.findAll', () => {
  test('should returns a list of genres with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual([])
  })
})
