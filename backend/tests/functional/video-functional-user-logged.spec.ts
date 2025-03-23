import { test } from '@japa/runner'

import UserLucid from '#models/user-model/user-lucid'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { getYoutubeThumbnail } from '#utils/index'

test.group('Video User Logged Route', () => {
  test('/GET user/my-lyrics - it must return 200 if user authenticated is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeVideo, fakeLanguage, fakeGenre } = await mockAllTables()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.get('user/my-lyrics').withCookie('AUTH', accessTokenValue)

    expect(response.status()).toBe(200)
    expect(response.body()[0].title).toBe(fakeVideo.title)
    expect(response.body()[0].artist).toBe(fakeVideo.artist)
    expect(response.body()[0].linkYoutube).toBe(fakeVideo.linkYoutube)
    expect(response.body()[0].language).toBe(fakeLanguage.name)
    expect(response.body()[0].username).toBe(fakeUser.username)
    expect(response.body()[0].thumbnail).toBe(getYoutubeThumbnail(fakeVideo.linkYoutube))
  })

  test('/GET user/my-lyrics - it must return 401 if user is not authenticated', async ({
    client,
    expect,
  }) => {
    const response = await client.get('user/my-lyrics')

    expect(response.status()).toBe(401)
  })
})
