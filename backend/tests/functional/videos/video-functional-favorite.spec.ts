import { APPLICATION_ERRORS } from '#helpers/application-errors'
import UserLucid from '#models/user-model/user-lucid'
import { mockVideoEntity } from '#tests/factories/fakes/mock-video-entity'
import { NilUUID } from '#tests/utils/NilUUID'
import { test } from '@japa/runner'

test.group('Video Favorite Routes', (group) => {
  test('/POST favorites/{uuid} - should return 200 if video add favorite on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockVideoEntity()

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
    const { fakeUser } = await mockVideoEntity()

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
    const { fakeUser } = await mockVideoEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.post(`favorites/${NilUUID}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
  })

  test('/POST favorites/{uuid} - should return 401 on add favorite if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`favorites/${NilUUID}`)

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual({ errors: [{ message: 'Unauthorized access' }] })
  })

  test('/DELETE favorites/{uuid}- should return 200 if video remove favorite on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockVideoEntity()

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

  test('/DELETE favorites/{uuid}- should return 400 on remove favorite if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockVideoEntity()

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

  test('/DELETE favorites/{uuid}- should return 404 on remove favorite if video not exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockVideoEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`favorites/${NilUUID}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
  })

  test('/DELETE favorites/{uuid}- should return 401 on remove favorite if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.delete(`favorites/${NilUUID}`)

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual({ errors: [{ message: 'Unauthorized access' }] })
  })
})
