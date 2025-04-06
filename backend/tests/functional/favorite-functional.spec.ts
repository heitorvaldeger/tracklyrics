import { test } from '@japa/runner'

import { User } from '#models/user'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { NilUUID } from '#tests/__utils__/NilUUID'

test.group('Favorite Routes', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })
  test('/POST favorites/{uuid} - return 200 if video add favorite on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockAllTables()

    const accessToken = await User.accessTokens.create(
      await User.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`favorites/${fakeVideo.uuid}`)
      .withCookie('AUTH', accessTokenValue)

    expect(response.status()).toBe(200)
    expect(response.body()).toBeTruthy()
  })

  test('/POST favorites/{uuid} - return 400 on add favorite if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const accessToken = await User.accessTokens.create(
      await User.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.post(`favorites/any_uuid`).withCookie('AUTH', accessTokenValue)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })

  test('/POST favorites/{uuid} - return 404 on add favorite if video not exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const accessToken = await User.accessTokens.create(
      await User.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.post(`favorites/${NilUUID}`).withCookie('AUTH', accessTokenValue)

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

  test('/DELETE favorites/{uuid} - return 200 if video remove favorite on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockAllTables()

    const accessToken = await User.accessTokens.create(
      await User.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .delete(`favorites/${fakeVideo.uuid}`)
      .withCookie('AUTH', accessTokenValue)

    expect(response.status()).toBe(200)
    expect(response.body()).toBeTruthy()
  })

  test('/DELETE favorites/{uuid} - return 400 on remove favorite if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const accessToken = await User.accessTokens.create(
      await User.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`favorites/any_uuid`).withCookie('AUTH', accessTokenValue)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })

  test('/DELETE favorites/{uuid} - return 404 on remove favorite if video not exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const accessToken = await User.accessTokens.create(
      await User.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .delete(`favorites/${NilUUID}`)
      .withCookie('AUTH', accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body().code).toEqual('E_VIDEO_NOT_FOUND')
  })

  test('/DELETE favorites/{uuid} - return 401 on remove favorite if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.delete(`favorites/${NilUUID}`)

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })

  test('/GET favorites - return 200 on find a list favorite videos by user logged', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockAllTables()

    const accessToken = await User.accessTokens.create(
      await User.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.get(`favorites`).withCookie('AUTH', accessTokenValue)

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
