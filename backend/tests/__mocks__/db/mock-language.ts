import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'

import { Language } from '#models/language'
import { toSnakeCase } from '#utils/index'
import { toCamelCase } from '#utils/index'

export const mockLanguage = async () => {
  const languages = await db
    .table('languages')
    .returning(['id', 'name', 'flag_country'])
    .insert(
      toSnakeCase({
        name: faker.lorem.words(2),
        flagCountry: faker.string.alpha({
          length: 2,
        }),
        createdAt: new Date().toISOString(),
      })
    )

  return toCamelCase<Language>(languages[0])
}
