import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

import UserLucid from '#models/user-model/user-lucid'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'

const httpRequest = mockVideoCreateOrUpdateRequest()

test.group('Video Create Route', (group) => {
  test('/POST videos/ - it must return 200 on create if video create on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeGenre, fakeLanguage } = await mockAllTables()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos`)
      .json({
        ...httpRequest,
        languageId: fakeLanguage.id,
        genreId: fakeGenre.id,
      })
      .withCookie('AUTH', accessTokenValue)

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
    const { fakeUser, fakeLanguage } = await mockAllTables()
    const { genreId, artist, ...rest } = httpRequest

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos`)
      .json({
        ...rest,
        languageId: fakeLanguage.id,
      })
      .withCookie('AUTH', accessTokenValue)

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
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })

  test('/POST videos/ - it must return 422 on create if video youtube already exists', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeLanguage, fakeVideo, fakeGenre } = await mockAllTables()
    const { genreId, languageId, ...rest } = httpRequest

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos`)
      .json({
        ...rest,
        linkYoutube: fakeVideo.linkYoutube,
        languageId: fakeLanguage.id,
        genreId: fakeGenre.id,
      })
      .withCookie('AUTH', accessTokenValue)

    expect(response.status()).toBe(422)
    expect(response.body().code).toBe('E_YOUTUBE_LINK_ALREADY_EXISTS')
  })
})
