import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { NilUUID } from '#tests/__utils__/NilUUID'

test.group('Video Find Route', () => {
  test('/GET videos/{uuid} - it must return 200 on search video by uuid', async ({
    client,
    expect,
  }) => {
    const { fakeLanguage, fakeUser, fakeVideo } = await mockAllTables()

    const response = await client.get(`/videos/${fakeVideo.uuid}`)

    expect(response.status()).toBe(200)
    expect(response.body().language).toBe(fakeLanguage.name)
    expect(response.body().username).toBe(fakeUser.username)
    expect(response.body().title).toBe(fakeVideo.title)
    expect(response.body().artist).toBe(fakeVideo.artist)
    expect(response.body().linkYoutube).toBe(fakeVideo.linkYoutube)
  })

  test('/GET videos/{uuid} - it must return 400 on search if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos/any_uuid`)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })

  test('/GET videos/{uuid} - it must return 404 on search if video uuid not exists', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos/${NilUUID}`)

    expect(response.status()).toBe(404)
    expect(response.body().code).toBe('E_VIDEO_NOT_FOUND')
  })
})
