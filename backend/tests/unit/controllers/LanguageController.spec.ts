import LanguageController from '#controllers/LanguageController'
import { test } from '@japa/runner'
import { ok } from '../../../app/helpers/http.js'
import Language from '#models/language'

test.group('LanguageController', (group) => {
  group.teardown(async () => {
    await Language.query().whereNotNull('id').delete()
  })

  test('should returns 200 if a list languages returns on success', async ({ assert }) => {
    const language = await Language.create({
      name: 'any_language',
    })
    const sut = new LanguageController()
    const languages = await sut.findAll()

    assert.deepEqual(languages, ok([language.serialize()]))
  })
})
