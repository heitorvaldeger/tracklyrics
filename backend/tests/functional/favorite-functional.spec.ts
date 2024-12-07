import { test } from '@japa/runner'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import UserLucid from '#models/user-model/user-lucid'
import { mockLucidEntity } from '#tests/factories/mocks/entities/mock-lucid-entity'
import { NilUUID } from '#tests/utils/NilUUID'

test.group('FavoriteLucid Routes', (group) => {
  test('/POST favorites/{uuid} - should return 200 if video add favorite on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.post(`favorites/${fakeVideo.uuid}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(200)
    expect(response.body()).toBeTruthy()
  })

  test('/POST favorites/{uuid} - should return 400 on add favorite if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.post(`favorites/any_uuid`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })

  test('/POST favorites/{uuid} - should return 404 on add favorite if video not exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.post(`favorites/${NilUUID}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
  })

  test('/POST favorites/{uuid} - should return 401 on add favorite if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`favorites/${NilUUID}`)

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual({ errors: [{ message: 'Unauthorized access' }] })
  })

  test('/DELETE favorites/{uuid} - should return 200 if video remove favorite on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .delete(`favorites/${fakeVideo.uuid}`)
      .bearerToken(accessTokenValue)

    expect(response.status()).toBe(200)
    expect(response.body()).toBeTruthy()
  })

  test('/DELETE favorites/{uuid} - should return 400 on remove favorite if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`favorites/any_uuid`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })

  test('/DELETE favorites/{uuid} - should return 404 on remove favorite if video not exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`favorites/${NilUUID}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
  })

  test('/DELETE favorites/{uuid} - should return 401 on remove favorite if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.delete(`favorites/${NilUUID}`)

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual({ errors: [{ message: 'Unauthorized access' }] })
  })

  test('/GET favorites - should return 200 on find a list favorite videos by user logged', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.get(`favorites`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(200)
    expect(response.body().length).toBe(1)
    expect(response.body()[0].title).toBe(fakeVideo.title)
    expect(response.body()[0].linkYoutube).toBe(fakeVideo.linkYoutube)
    expect(response.body()[0].artist).toBe(fakeVideo.artist)
  })

  test('/GET favorites - should return 401 on find a list favorite videos by user logged if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`favorites`)

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual({ errors: [{ message: 'Unauthorized access' }] })
  })
})
