import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import UserLucid from '#models/user-model/user-lucid'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { NilUUID } from '#tests/__utils__/NilUUID'

test.group('Lyric Find Route', () => {
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
    expect(response.body()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  })

  test('/GET videos/:uuid/lyrics - it must return 404 if video not found', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos/${NilUUID}/lyrics`)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
  })
})
