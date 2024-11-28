import { APPLICATION_ERRORS } from '#helpers/application-errors'
import GenreLucid from '#models/genre-model/genre-lucid'
import { LanguageLucid } from '#models/language-model/language-lucid'
import Favorite from '#models/lucid-orm/favorite'
import UserLucid from '#models/user-model/user-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { mockVideoEntity } from '#tests/factories/fakes/mock-video-entity'
import { NilUUID } from '#tests/utils/NilUUID'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { now } from 'lodash'

test.group('Video Delete Route', (group) => {
  group.each.setup(async () => {
    await Favorite.query().del()
    await VideoLucid.query().del()
    await UserLucid.query().del()
    await GenreLucid.query().del()
    await LanguageLucid.query().del()
  })

  test('/DELETE videos/{uuid} - should return 404 if video not belong user uuid', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockVideoEntity()
    const { fakeVideo } = await mockVideoEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`/videos/${fakeVideo.uuid}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
  })

  test('/DELETE videos/{uuid} - should return 200 if user uuid is valid and video exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo } = await mockVideoEntity()

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
    const { fakeUser } = await mockVideoEntity()

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
    const { fakeUser } = await mockVideoEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.delete(`/videos/${NilUUID}`).bearerToken(accessTokenValue)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
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
