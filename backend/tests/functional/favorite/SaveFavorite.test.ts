import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { NilUUID } from '#tests/__utils__/NilUUID'

test.group('Favorite/SaveFavorite', async () => {
  test('/POST favorites/{uuid} - return 200 if video add favorite on success', async ({
    client,
    expect,
  }) => {
    const { fakeVideo, fakeUser } = await mockAllTables()

    const response = await client
      .post(`favorites/${fakeVideo.uuid}`)

      .loginAs(fakeUser)

    expect(response.status()).toBe(200)
    expect(response.body()).toBeTruthy()
  })

  test('/POST favorites/{uuid} - return 400 on add favorite if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const response = await client.post(`favorites/any_uuid`).loginAs(fakeUser)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual({
      code: 'E_VALIDATION_ERROR',
      errors: [{ error: 'Invalid uuid', field: 'uuid' }],
    })
  })

  test('/POST favorites/{uuid} - return 404 on add favorite if video not exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()
    const response = await client.post(`favorites/${NilUUID}`).loginAs(fakeUser)

    expect(response.status()).toBe(404)
    expect(response.body().code).toBe('E_VIDEO_NOT_FOUND')
  })

  test('/POST favorites/{uuid} - return 401 on add favorite if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`favorites/${NilUUID}`)

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })
})
