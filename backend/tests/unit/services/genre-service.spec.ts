import { test } from '@japa/runner'
import { GenreRepository } from '#repository/protocols/base-repository'
import { GenreService } from '#services/genre-service'

const mockGenreRepositoryStub = (): GenreRepository => ({
  findAll: () => Promise.resolve([]),
})

const makeSut = () => {
  const fakeGenreRepositoryStub = mockGenreRepositoryStub()
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
