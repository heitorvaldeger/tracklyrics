import GenreLucid from '#models/genre-model/genre-lucid'
import { test } from '@japa/runner'

test.group('Genre Routes', (group) => {
  test('/GET genres - should return 200 on load genres success', async ({ client, expect }) => {
    const genres = await GenreLucid.createMany([
      {
        name: 'English',
      },
      {
        name: 'Portuguese',
      },
    ])
    const response = await client.get('/genres')

    expect(response.status()).toBe(200)
    expect(response.body()).toEqual(genres.map((genre) => genre.serialize()))
  })
})
