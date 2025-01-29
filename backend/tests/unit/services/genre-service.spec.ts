import { test } from '@japa/runner'

import { GenreService } from '#services/genre-service'
import { mockGenreRepositoryStub } from '#tests/__mocks__/stubs/mock-genre-stub'

const makeSut = () => {
  const fakeGenreRepositoryStub = mockGenreRepositoryStub()
  const sut = new GenreService(fakeGenreRepositoryStub)

  return { sut }
}

test.group('GenreService.findAll', () => {
  test('it must returns a list of genres with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual([])
  })
})
