import { test } from '@japa/runner'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { mockLucidEntity } from '#tests/__mocks__/entities/mock-lucid-entity'
import { mockGameModesData } from '#tests/__mocks__/stubs/mock-game-stub'
import { NilUUID } from '#tests/__utils__/NilUUID'

test.group('Game Routes', (group) => {
  test('/PUT game/{uuid}/play - return 204 if video play on success', async ({
    client,
    expect,
  }) => {
    const { fakeVideo } = await mockLucidEntity()

    const response = await client.put(`game/${fakeVideo.uuid}/play`)

    expect(response.status()).toBe(204)
  })

  test('/PUT game/{uuid}/play - return 400 on video play if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const response = await client.put(`game/invalid_uuid/play`)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })

  test('/PUT game/{uuid}/play - return 404 on video play if video not exists', async ({
    client,
    expect,
  }) => {
    const response = await client.put(`game/${NilUUID}/play`)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
  })

  test('/GET game/{uuid}/modes - return 200 with modes on success', async ({ client, expect }) => {
    const { fakeVideo, fakeLyrics } = await mockLucidEntity()

    const response = await client.get(`game/${fakeVideo.uuid}/modes`)

    const totalWords = fakeLyrics.reduce((acc, value) => acc + value.line.length, 0)
    expect(response.status()).toBe(200)
    expect(response.body().beginner).toEqual({
      percent: mockGameModesData.beginnerPercent,
      totalFillWords: Number(((totalWords * mockGameModesData.beginnerPercent) / 100).toFixed()),
    })
    expect(response.body().intermediate).toEqual({
      percent: mockGameModesData.intermediatePercent,
      totalFillWords: Number(
        ((totalWords * mockGameModesData.intermediatePercent) / 100).toFixed()
      ),
    })
    expect(response.body().advanced).toEqual({
      percent: mockGameModesData.advancedPercent,
      totalFillWords: Number(((totalWords * mockGameModesData.advancedPercent) / 100).toFixed()),
    })
    expect(response.body().specialist).toEqual({
      percent: mockGameModesData.specialistPercent,
      totalFillWords: Number(((totalWords * mockGameModesData.specialistPercent) / 100).toFixed()),
    })
  })

  test('/GET game/{uuid}/modes - return 404 on get modes if video not exists', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`game/${NilUUID}/modes`)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
  })

  test('/GET game/{uuid}/modes - return 400 on get modes if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`game/invalid_uuid/modes`)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })
})
