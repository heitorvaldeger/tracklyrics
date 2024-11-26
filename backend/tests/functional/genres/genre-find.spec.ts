import GenreLucid from '#models/genre-model/genre-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { test } from '@japa/runner'

test.group('Genre Routes', (group) => {
  group.each.setup(async () => {
    await VideoLucid.query().delete()
    await GenreLucid.query().delete()
  })

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
