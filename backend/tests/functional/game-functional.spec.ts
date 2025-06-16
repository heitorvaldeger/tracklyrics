import { test } from '@japa/runner'

import { GameModesHash } from '#enums/game-modes-hash'
import { GameModesPercent } from '#enums/game-modes-percent'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { NilUUID } from '#tests/__utils__/NilUUID'

test.group('Game Routes', (group) => {
  test('/PUT game/{uuid}/play - return 204 if video play on success', async ({
    client,
    expect,
  }) => {
    const { fakeVideo } = await mockAllTables()

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
    expect(response.body().code).toBe('E_VIDEO_NOT_FOUND')
  })

  test('/GET game/{uuid}/modes - return 200 with modes on success', async ({ client, expect }) => {
    const { fakeVideo, fakeLyrics } = await mockAllTables()

    const response = await client.get(`game/${fakeVideo.uuid}/modes`)

    const totalWords = fakeLyrics.reduce((acc, value) => acc + value.line.split(' ').length, 0)
    expect(response.status()).toBe(200)
    expect(response.body().beginner).toEqual({
      percent: GameModesPercent.BEGINNER,
      gaps: Number(((totalWords * GameModesPercent.BEGINNER) / 100).toFixed()),
      id: GameModesHash.BEGINNER,
    })
    expect(response.body().intermediate).toEqual({
      percent: GameModesPercent.INTERMEDIATE,
      gaps: Number(((totalWords * GameModesPercent.INTERMEDIATE) / 100).toFixed()),
      id: GameModesHash.INTERMEDIATE,
    })
    expect(response.body().advanced).toEqual({
      percent: GameModesPercent.ADVANCED,
      gaps: Number(((totalWords * GameModesPercent.ADVANCED) / 100).toFixed()),
      id: GameModesHash.ADVANCED,
    })
    expect(response.body().specialist).toEqual({
      percent: GameModesPercent.SPECIALIST,
      gaps: Number(((totalWords * GameModesPercent.SPECIALIST) / 100).toFixed()),
      id: GameModesHash.SPECIALIST,
    })
  })

  test('/GET game/{uuid}/modes - return 404 on get modes if video not exists', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`game/${NilUUID}/modes`)

    expect(response.status()).toBe(404)
    expect(response.body().code).toBe('E_VIDEO_NOT_FOUND')
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
