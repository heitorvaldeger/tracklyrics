import GenreController from '#controllers/genre-controller'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { IGenreService } from '#services/interfaces/IGenreService'

export const mockGenreServiceStub = () => {
  class GenreServiceStub implements IGenreService {
    async findAll(): Promise<GenreFindModel[]> {
      return new Promise((resolve) =>
        resolve([
          {
            id: 0,
            name: 'any_name',
          },
        ])
      )
    }
  }

  return new GenreServiceStub()
}

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
