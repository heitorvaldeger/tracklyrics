import GenreController from '#controllers/genre-controller'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import { GenreProtocolService } from '#services/protocols/genre-protocol-service'

const mockGenreServiceStub = (): GenreProtocolService => ({
  findAll: () =>
    Promise.resolve([
      {
        id: 0,
        name: 'any_name',
      },
    ]),
})

const makeSut = () => {
  const genreServiceStub = mockGenreServiceStub()
  const sut = new GenreController(genreServiceStub)

  return { sut }
}

test.group('GenreController.findAll()', () => {
  test('should returns a list of genres on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(
      ok([
        {
          id: 0,
          name: 'any_name',
        },
      ])
    )
  })
})
