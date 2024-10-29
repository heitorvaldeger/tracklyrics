import _ from 'lodash'
import { test } from '@japa/runner'
import { GenrerPostgresRepository } from '#repository/postgres/GenrerPostgresRepository'
import { makeFakeGenrer } from '#tests/factories/makeFakeGenrer'
import Genrer from '#models/genrer'
import Video from '#models/video'

const makeSut = () => {
  const sut = new GenrerPostgresRepository()
  return { sut }
}

test.group('GenrerService.findAll', (group) => {
  group.setup(async () => {
    await Video.query().whereNotNull('id').delete()
    await Genrer.query().whereNotNull('id').delete()
  })

  test('should returns a list of genres with on success', async ({ expect }) => {
    const fakeGenrer = (await makeFakeGenrer()).serialize()
    const { sut } = makeSut()

    const genrers = await sut.findAll()

    expect(genrers).toEqual([fakeGenrer])
  })
})
