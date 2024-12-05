import { test } from '@japa/runner'
import _ from 'lodash'

import { mockGenreEntity } from '#tests/factories/fakes/index'

import { GenrePostgresRepository } from '../../../../app/infra/db/postgres/genre-postgres-repository.js'

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
