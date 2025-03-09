import { test } from '@japa/runner'

import GenreController from '#controllers/genre-controller'
import { ok } from '#helpers/http'
import { createSuccessResponse } from '#helpers/method-response'
import { GenreProtocolService } from '#services/_protocols/genre-protocol-service'

const mockGenreServiceStub = (): GenreProtocolService => ({
  findAll: () =>
    Promise.resolve(
      createSuccessResponse([
        {
          id: 0,
          name: 'any_name',
        },
      ])
    ),
})

const makeSut = () => {
  const genreServiceStub = mockGenreServiceStub()
  const sut = new GenreController(genreServiceStub)

  return { sut }
}

test.group('GenreController.findAll()', () => {
  test('it must returns a list of genres on success', async ({ expect }) => {
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
