import GenrerController from '#controllers/GenrerController'
import Genrer from '#models/genrer'
import { test } from '@japa/runner'

test.group('GenrerController', (group) => {
  group.each.teardown(async () => {
    await Genrer.query().whereNotNull('id').delete()
  })

  test('should returns a list of genres with on success', async ({ assert }) => {
    const genrer = await Genrer.create({
      name: 'any_name',
    })

    const sut = new GenrerController()
    const genres = await sut.findAll()

    assert.deepEqual(genres, [genrer.serialize()])
  })
})
