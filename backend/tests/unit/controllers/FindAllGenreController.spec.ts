import { test } from '@japa/runner'
import { stub } from 'sinon'

import FindAllGenreController from '#controllers/FindAllGenreController'
import { IGenreService } from '#services/interfaces/genre-service'

const mockGenreServiceStub = (): IGenreService => ({
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
  const sut = new FindAllGenreController(genreServiceStub)

  return { sut, genreServiceStub }
}

test.group('FindAllGenreController', () => {
  test('it must returns a list of genres on success', async ({ expect }) => {
    const { sut } = makeSut()

    const genres = await sut.handle()

    expect(genres).toEqual([
      {
        id: 0,
        name: 'any_name',
      },
    ])
  })

  test('return 500 if genres find all throws', async ({ expect }) => {
    const { sut, genreServiceStub } = makeSut()

    stub(genreServiceStub, 'findAll').throws(new Error())

    const promise = sut.handle()

    await expect(promise).rejects.toEqual(new Error())
  })
})
