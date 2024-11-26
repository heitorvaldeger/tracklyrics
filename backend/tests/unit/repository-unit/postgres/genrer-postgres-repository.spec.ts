import _ from 'lodash'
import { test } from '@japa/runner'
import { GenrerPostgresRepository } from '#repository/postgres-repository/genrer-postgres-repository'
import VideoLucid from '#models/video-model/video-lucid'
import GenrerLucid from '#models/genrer-model/genrer-lucid'
import { mockFakeGenrer } from '#tests/factories/fakes/index'

const makeSut = () => {
  const sut = new GenrerPostgresRepository()
  return { sut }
}

test.group('GenrerPostgresRepository.findAll', (group) => {
  group.setup(async () => {
    await VideoLucid.query().delete()
    await GenrerLucid.query().delete()
  })

  test('should returns a list of genres with on success', async ({ expect }) => {
    const fakeGenrer = (await mockFakeGenrer()).serialize()
    const { sut } = makeSut()

    const genrers = await sut.findAll()

    expect(genrers).toEqual([fakeGenrer])
  })
})
