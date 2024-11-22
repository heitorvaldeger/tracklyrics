import GenrerLucid from '#models/genrer-model/genrer-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { test } from '@japa/runner'

test.group('Genrer Routes', (group) => {
  group.each.setup(async () => {
    await VideoLucid.query().delete()
    await GenrerLucid.query().delete()
  })

  test('/GET genrers - should return 200 on load genrers success', async ({ client, expect }) => {
    const genrers = await GenrerLucid.createMany([
      {
        name: 'English',
      },
      {
        name: 'Portuguese',
      },
    ])
    const response = await client.get('/genrers')

    expect(response.status()).toBe(200)
    expect(response.body()).toEqual(genrers.map((genrer) => genrer.serialize()))
  })
})
