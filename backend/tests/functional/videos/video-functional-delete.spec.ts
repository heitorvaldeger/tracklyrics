import { test } from '@japa/runner'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import UserLucid from '#models/user-model/user-lucid'
import { mockLucidEntity } from '#tests/factories/mocks/entities/mock-lucid-entity'
import { NilUUID } from '#tests/utils/NilUUID'

test.group('Video Delete Route', (group) => {
  test('/DELETE videos/{uuid} - should return 404 if video not belong user uuid', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockLucidEntity()
    const { fakeVideo } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`/videos/${fakeVideo.uuid}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
  })

  test('/DELETE videos/{uuid} - should return 200 if user uuid is valid and video exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`/videos/${fakeVideo.uuid}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(200)
    expect(response.body()).toBeTruthy()
  })

  test('/DELETE videos/{uuid} - should return 400 on delete if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`/videos/any_value`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })

  test('/DELETE videos/{uuid} - should return 404 on delete if video not exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`/videos/${NilUUID}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
  })

  test('/DELETE videos/{uuid} - should return 401 on delete if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.delete(`/videos/${NilUUID}`)

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual({ errors: [{ message: 'Unauthorized access' }] })
  })
})
