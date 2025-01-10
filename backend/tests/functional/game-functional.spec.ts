import { test } from '@japa/runner'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { makeGameModesStub } from '#tests/factories/makeGameModesResponse'
import { mockLucidEntity } from '#tests/factories/mocks/entities/mock-lucid-entity'
import { NilUUID } from '#tests/utils/NilUUID'

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
      percent: makeGameModesStub().beginnerPercent,
      totalFillWords: Number(((totalWords * makeGameModesStub().beginnerPercent) / 100).toFixed()),
    })
    expect(response.body().intermediate).toEqual({
      percent: makeGameModesStub().intermediatePercent,
      totalFillWords: Number(
        ((totalWords * makeGameModesStub().intermediatePercent) / 100).toFixed()
      ),
    })
    expect(response.body().advanced).toEqual({
      percent: makeGameModesStub().advancedPercent,
      totalFillWords: Number(((totalWords * makeGameModesStub().advancedPercent) / 100).toFixed()),
    })
    expect(response.body().specialist).toEqual({
      percent: makeGameModesStub().specialistPercent,
      totalFillWords: Number(
        ((totalWords * makeGameModesStub().specialistPercent) / 100).toFixed()
      ),
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
