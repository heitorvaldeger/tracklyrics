import GenreLucid from '#models/genre-model/genre-lucid'
import { LanguageLucid } from '#models/language-model/language-lucid'
import Favorite from '#models/lucid-orm/favorite'
import UserLucid from '#models/user-model/user-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { mockVideoEntity } from '#tests/factories/fakes/mock-video-entity'
import { mockVideoRequest } from '#tests/factories/fakes/mock-video-request'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('Video Create Route', (group) => {
  group.each.setup(async () => {
    await Favorite.query().del()
    await VideoLucid.query().del()
    await UserLucid.query().del()
    await GenreLucid.query().del()
    await LanguageLucid.query().del()
  })

  test('/POST videos/ - should return 200 on create if video create on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeGenre, fakeLanguage } = await mockVideoEntity()
    const httpRequest = mockVideoRequest()

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

  test('/POST videos/ - should return 400 on create if any param is invalid', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeLanguage } = await mockVideoEntity()
    const { genreId, artist, ...httpRequest } = mockVideoRequest()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client
      .post(`/videos`)
      .fields({
        ...httpRequest,
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

  test('/POST videos/ - should return 401 on create if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/videos`).fields({})

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual({ errors: [{ message: 'Unauthorized access' }] })
  })
})
