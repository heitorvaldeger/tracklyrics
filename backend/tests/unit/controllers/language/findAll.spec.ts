import LanguageController from '#controllers/LanguageController'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import Language from '#models/language'

test.group('LanguageController.findAll', (group) => {
  group.teardown(async () => {
    await Language.query().whereNotNull('id').delete()
  })

  test('should returns 200 if a list languages returns on success', async ({ expect }) => {
    const language = await Language.create({
      name: 'any_language',
    })
    const sut = new LanguageController()
    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(ok([language.serialize()]))
  })
})
