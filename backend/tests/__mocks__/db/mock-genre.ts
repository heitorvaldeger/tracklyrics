import db from '@adonisjs/lucid/services/db'
import { faker } from '@faker-js/faker'

import { Genre } from '#models/genre'
import { toSnakeCase } from '#utils/index'
import { toCamelCase } from '#utils/index'

export const mockGenre = async (): Promise<Genre> => {
  const genres = await db
    .table('genres')
    .returning(['id', 'name'])
    .insert(
      toSnakeCase({
        name: faker.lorem.words(2),
        createdAt: new Date().toISOString(),
      })
    )

  return toCamelCase<Genre>(genres[0])
}
