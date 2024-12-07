import { test } from '@japa/runner'

import { GenrePostgresRepository } from '#infra/db/repository/postgres/genre-postgres-repository'
import { mockGenreEntity } from '#tests/factories/mocks/entities/mock-genre-entity'

const makeSut = () => {
  const sut = new GenrePostgresRepository()
  return { sut }
}

test.group('GenrePostgresRepository', (group) => {
  test('should returns a list of genres with on success', async ({ expect }) => {
    const fakeGenre = (await mockGenreEntity()).serialize()
    const { sut } = makeSut()

    const genres = await sut.findAll()

    expect(genres).toEqual([fakeGenre])
  })

  test('should return a genre if genre id exists', async ({ expect }) => {
    const fakeGenre = await mockGenreEntity()
    const { sut } = makeSut()

    const genre = await sut.findById(fakeGenre.id)

    expect(genre).toEqual(fakeGenre.serialize())
  })

  test('should return null if genre id not exists', async ({ expect }) => {
    const { sut } = makeSut()

    const genre = await sut.findById(-1)

    expect(genre).toBeFalsy()
  })
})
