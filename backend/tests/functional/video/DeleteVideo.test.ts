import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { NilUUID } from '#tests/__utils__/NilUUID'

test.group('Video/DeleteVideoRoute', () => {
  test('/DELETE videos/{uuid} - it must return 404 if video not belong user uuid', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()
    const { fakeVideo } = await mockAllTables()

    const response = await client.delete(`/videos/${fakeVideo.uuid}`).loginAs(fakeUser)

    expect(response.status()).toBe(404)
    expect(response.body().code).toBe('E_VIDEO_NOT_FOUND')
  })

  test('/DELETE videos/{uuid} - it must return 200 if user uuid is valid and video exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockAllTables()

    const response = await client.delete(`/videos/${fakeVideo.uuid}`).loginAs(fakeUser)

    expect(response.status()).toBe(200)
    expect(response.body()).toBeTruthy()
  })

  test('/DELETE videos/{uuid} - it must return 400 on delete if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const response = await client.delete(`/videos/any_value`).loginAs(fakeUser)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual({
      code: 'E_VALIDATION_ERROR',
      errors: [{ error: 'Invalid uuid', field: 'uuid' }],
    })
  })

  test('/DELETE videos/{uuid} - it must return 404 on delete if video not exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const response = await client.delete(`/videos/${NilUUID}`).loginAs(fakeUser)

    expect(response.status()).toBe(404)
    expect(response.body().code).toBe('E_VIDEO_NOT_FOUND')
  })

  test('/DELETE videos/{uuid} - it must return 401 on delete if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.delete(`/videos/${NilUUID}`)

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })
})
