import { test } from '@japa/runner'
import { stub } from 'sinon'

import GenreController from '#controllers/genre-controller'
import { GenreProtocolService } from '#services/_protocols/genre-protocol-service'

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

  return { sut, genreServiceStub }
}

test.group('GenreController', () => {
  test('it must returns a list of genres on success', async ({ expect }) => {
    const { sut } = makeSut()

    const genres = await sut.findAll()

    expect(genres).toEqual([
      {
        id: 0,
        name: 'any_name',
      },
    ])
  })

  test('return 500 if genres find all throws', ({ expect }) => {
    const { sut, genreServiceStub } = makeSut()

    stub(genreServiceStub, 'findAll').throws(new Error())

    const httpResponse = sut.findAll()

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
