import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'

test.group('Favorite Routes', async (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('/GET favorites - return 200 on find a list favorite videos by user logged', async ({
    client,
    expect,
  }) => {
    const { fakeVideo, fakeUser } = await mockAllTables()

    const response = await client.get(`favorites`).loginAs(fakeUser)

    expect(response.status()).toBe(200)
    expect(response.body().length).toBe(1)
    expect(response.body()[0].title).toBe(fakeVideo.title)
    expect(response.body()[0].linkYoutube).toBe(fakeVideo.linkYoutube)
    expect(response.body()[0].artist).toBe(fakeVideo.artist)
  })

  test('/GET favorites - return 401 on find a list favorite videos by user logged if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`favorites`)

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })
})
