import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

import { Genre } from '#models/genre'
import { toCamelCase } from '#utils/index'

test.group('Genre Routes', (group) => {
  test('/GET genres - it must return 200 on load genres success', async ({ client, expect }) => {
    const genres = (await db
      .table('genres')
      .returning(['id', 'name'])
      .insert([
        {
          name: 'English',
        },
        {
          name: 'Portuguese',
        },
      ])) as Genre[]
    const response = await client.get('/genres')

    expect(response.status()).toBe(200)
    expect(response.body()).toEqual(genres.map(toCamelCase))
  })
})
