import GenrerController from '#controllers/GenrerController'
import Genrer from '#models/genrer'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'

test.group('GenrerController.findAll', (group) => {
  group.each.teardown(async () => {
    await Genrer.query().whereNotNull('id').delete()
  })

  test('should returns a list of genres with on success', async ({ expect }) => {
    const genrer = await Genrer.create({
      name: 'any_name',
    })

    const sut = new GenrerController()
    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(ok([genrer.serialize()]))
  })
})
