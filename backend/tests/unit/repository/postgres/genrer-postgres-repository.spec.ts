import _ from 'lodash'
import { test } from '@japa/runner'
import { GenrerPostgresRepository } from '#repository/postgres/genrer-postgres-repository'
import { makeFakeGenrer } from '#tests/factories/fakes/makeFakeGenrer'
import VideoLucid from '#models/video/video-lucid'
import GenrerLucid from '#models/genrer/genrer-lucid'

const makeSut = () => {
  const sut = new GenrerPostgresRepository()
  return { sut }
}

test.group('GenrerPostgresRepository.findAll', (group) => {
  group.setup(async () => {
    await VideoLucid.query().whereNotNull('id').delete()
    await GenrerLucid.query().whereNotNull('id').delete()
  })

  test('should returns a list of genres with on success', async ({ expect }) => {
    const fakeGenrer = (await makeFakeGenrer()).serialize()
    const { sut } = makeSut()

    const genrers = await sut.findAll()

    expect(genrers).toEqual([fakeGenrer])
  })
})
