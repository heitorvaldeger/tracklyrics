import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import UserLucid from '#models/user-model/user-lucid'
import { mockLucidEntity } from '#tests/factories/mocks/entities/mock-lucid-entity'
import { NilUUID } from '#tests/utils/NilUUID'

test.group('Lyric Save Route', () => {
  test('/POST videos/:uuid/lyrics - it must return 200 if lyric save with success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos/${fakeVideo.uuid}/lyrics`)
      .json([
        {
          startTime: '00:00:00',
          endTime: '00:00:10',
          line: faker.lorem.sentence(5),
        },
        {
          startTime: '00:00:11',
          endTime: '00:00:16',
          line: faker.lorem.sentence(5),
        },
        {
          startTime: '00:00:18',
          endTime: '00:00:23',
          line: faker.lorem.sentence(5),
        },
      ])
      .bearerToken(accessTokenValue)

    expect(response.status()).toBe(200)
    expect(response.body()).toEqual({
      countLyricsInserted: 3,
    })
  })

  test('/POST videos/:uuid/lyrics - it must return 400 on lyric save if any param is invalid', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos/${fakeVideo.uuid}/lyrics`)
      .json([
        {
          startTime: 'invalid_time',
          endTime: 'invalid_time',
          line: faker.lorem.sentence(5),
        },
      ])
      .bearerToken(accessTokenValue)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      {
        field: 'startTime',
        message: 'The startTime field must be pattern 00:00:00',
      },
      {
        field: 'endTime',
        message: 'The endTime field must be pattern 00:00:00',
      },
    ])
  })

  test('/POST videos/:uuid/lyrics - it must return 401 on lyric save if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`videos/${NilUUID}/lyrics`).fields({})

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual({ errors: [{ message: 'Unauthorized access' }] })
  })

  test('/POST videos/:uuid/lyrics - it must return 404 if video not belong user uuid', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockLucidEntity()
    const { fakeVideo } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos/${fakeVideo.uuid}/lyrics`)
      .json([
        {
          startTime: '00:00:00',
          endTime: '00:00:10',
          line: faker.lorem.sentence(5),
        },
        {
          startTime: '00:00:11',
          endTime: '00:00:16',
          line: faker.lorem.sentence(5),
        },
        {
          startTime: '00:00:18',
          endTime: '00:00:23',
          line: faker.lorem.sentence(5),
        },
      ])
      .bearerToken(accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
  })

  test('/POST videos/:uuid/lyrics - it must return 400 on lyric save if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.post(`/videos/any_value/lyrics`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })
})
