import { test } from '@japa/runner'

import { GenrePostgresRepository } from '#infra/db/repository/genre-repository'
import { mockGenre } from '#tests/__mocks__/db/mock-genre'

const makeSut = () => {
  const sut = new GenrePostgresRepository()
  return { sut }
}

test.group('GenrePostgresRepository', (group) => {
  test('it must returns a list of genres with on success', async ({ expect }) => {
    const fakeGenre = await mockGenre()
    const { sut } = makeSut()

    const genres = await sut.findAll()

    expect(genres).toEqual([fakeGenre])
  })

  test('it must return a genre if genre id exists', async ({ expect }) => {
    const fakeGenre = await mockGenre()
    const { sut } = makeSut()

    const genre = await sut.findById(fakeGenre.id)

    expect(genre).toEqual(fakeGenre)
  })

  test('it must return null if genre id not exists', async ({ expect }) => {
    const { sut } = makeSut()

    const genre = await sut.findById(-1)

    expect(genre).toBeFalsy()
  })
})
