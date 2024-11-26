import _ from 'lodash'
import { test } from '@japa/runner'
import { GenrePostgresRepository } from '#repository/postgres-repository/genre-postgres-repository'
import VideoLucid from '#models/video-model/video-lucid'
import GenreLucid from '#models/genre-model/genre-lucid'
import { mockGenreEntity } from '#tests/factories/fakes/index'

const makeSut = () => {
  const sut = new GenrePostgresRepository()
  return { sut }
}

test.group('GenrePostgresRepository.findAll', (group) => {
  group.setup(async () => {
    await VideoLucid.query().delete()
    await GenreLucid.query().delete()
  })

  test('should returns a list of genres with on success', async ({ expect }) => {
    const fakeGenre = (await mockGenreEntity()).serialize()
    const { sut } = makeSut()

    const genres = await sut.findAll()

    expect(genres).toEqual([fakeGenre])
  })
})
