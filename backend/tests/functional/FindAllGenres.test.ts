import { test } from '@japa/runner'

import { Genre } from '#models/genre'

test.group('FindAllGenresRoutes', () => {
  test('/GET genres - it must return 200 on load genres success', async ({ client, expect }) => {
    const genres = (
      await Genre.createMany([
        {
          name: 'Portuguese',
        },
        {
          name: 'English',
        },
      ])
    ).map((genre) => genre.serialize())
    const response = await client.get('/genres')

    expect(response.status()).toBe(200)

    expect(response.body()).toEqual(genres)
  })
})
