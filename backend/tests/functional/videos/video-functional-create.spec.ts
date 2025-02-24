import { test } from '@japa/runner'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import UserLucid from '#models/user-model/user-lucid'
import { mockLucidEntity } from '#tests/__mocks__/entities/mock-lucid-entity'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'

const httpRequest = mockVideoCreateOrUpdateRequest()

test.group('Video Create Route', (group) => {
  test('/POST videos/ - it must return 200 on create if video create on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeGenre, fakeLanguage } = await mockLucidEntity()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos`)
      .fields({
        ...httpRequest,
        languageId: fakeLanguage.id,
        genreId: fakeGenre.id,
      })
      .bearerToken(accessTokenValue)

    expect(response.status()).toBe(200)
    expect(response.body().artist).toBe(httpRequest.artist)
    expect(response.body().linkYoutube).toBe(httpRequest.linkYoutube)
    expect(response.body().title).toBe(httpRequest.title)
    expect(response.body().releaseYear).toBe(httpRequest.releaseYear)
  })

  test('/POST videos/ - it must return 400 on create if any param is invalid', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeLanguage } = await mockLucidEntity()
    const { genreId, artist, ...rest } = httpRequest

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos`)
      .fields({
        ...rest,
        languageId: fakeLanguage.id,
      })
      .bearerToken(accessTokenValue)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      {
        field: 'artist',
        message: 'The artist field must be defined',
      },
      {
        field: 'genreId',
        message: 'The genreId field must be defined',
      },
    ])
  })

  test('/POST videos/ - it must return 401 on create if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/videos`).fields({})

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.UNAUTHORIZED)
  })

  test('/POST videos/ - it must return 422 on create if video youtube already exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeLanguage, fakeVideo, fakeGenre } = await mockLucidEntity()
    const { genreId, languageId, ...rest } = httpRequest

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos`)
      .fields({
        ...rest,
        linkYoutube: fakeVideo.linkYoutube,
        languageId: fakeLanguage.id,
        genreId: fakeGenre.id,
      })
      .bearerToken(accessTokenValue)

    expect(response.status()).toBe(422)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.YOUTUBE_LINK_ALREADY_EXISTS)
  })
})
