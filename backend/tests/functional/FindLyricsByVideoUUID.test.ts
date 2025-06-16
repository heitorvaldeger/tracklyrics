import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'

test.group('FindLyricsByVideoUUIDRoutes', () => {
  test('/GET videos/:uuid/lyrics - it must return 200 on video lyrics find with success', async ({
    client,
    expect,
  }) => {
    const { fakeLyrics, fakeVideo } = await mockAllTables()

    const response = await client.get(`/videos/${fakeVideo.uuid}/lyrics`)

    expect(response.status()).toBe(200)
    expect(response.body().length).toBe(fakeLyrics.length)
    expect(response.body()[0].seq).toBe(fakeLyrics[0].seq)
    expect(response.body()[0].line).toBe(fakeLyrics[0].line)
  })

  test('/GET videos/:uuid/lyrics - it must return 400 if videoUuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos/invalid_uuid/lyrics`)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual({
      code: 'E_VALIDATION_ERROR',
      errors: [{ error: 'Invalid uuid', field: 'uuid' }],
    })
  })

  test('/GET videos/:uuid/lyrics - it must return 404 if video not found', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos/${randomUUID()}/lyrics`)

    expect(response.status()).toBe(404)
    expect(response.body().code).toBe('E_VIDEO_NOT_FOUND')
  })
})
