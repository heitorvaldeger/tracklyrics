import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { NilUUID } from '#tests/__utils__/NilUUID'

test.group('Game/PlayGameRoute', () => {
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
    expect(response.body()).toEqual({
      code: 'E_VALIDATION_ERROR',
      errors: [{ error: 'Invalid uuid', field: 'uuid' }],
    })
  })

  test('/PUT game/{uuid}/play - return 404 on video play if video not exists', async ({
    client,
    expect,
  }) => {
    const response = await client.put(`game/${NilUUID}/play`)

    expect(response.status()).toBe(404)
    expect(response.body().code).toBe('E_VIDEO_NOT_FOUND')
  })
})
