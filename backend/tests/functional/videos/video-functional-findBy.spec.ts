import Favorite from '#models/lucid-orm/favorite'
import UserLucid from '#models/user-model/user-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { mockVideoEntity } from '#tests/factories/fakes/mock-video-entity'
import { test } from '@japa/runner'

test.group('Video FindBy Route', (group) => {
  group.each.setup(async () => {
    await Favorite.query().del()
    await VideoLucid.query().del()
    await UserLucid.query().del()
  })

  test('/GET videos?{genreId} - should return a list videos if genreId is provided', async ({
    client,
    expect,
  }) => {
    const { fakeGenre } = await mockVideoEntity()
    await mockVideoEntity()

    const response = await client.get(`/videos?genreId=${fakeGenre.id}`)

    expect(response.status()).toBe(200)
    expect(response.body().length).toBe(1)
  })

  test('/GET videos?{userUuid} - should return a list videos if userUuid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockVideoEntity()
    await mockVideoEntity()

    const response = await client.get(`/videos?userUuid=${fakeUser.uuid}`)

    expect(response.status()).toBe(200)
    expect(response.body().length).toBe(1)
  })

  test('/GET videos - should return a list videos if nothing params is provided', async ({
    client,
    expect,
  }) => {
    await mockVideoEntity()
    await mockVideoEntity()

    const response = await client.get(`/videos`)

    expect(response.status()).toBe(200)
    expect(response.body().length).toBe(2)
  })

  test('/GET videos - should return 400 if invalid params is provided', async ({
    client,
    expect,
  }) => {
    await mockVideoEntity()
    await mockVideoEntity()

    const response = await client.get(
      `/videos?userUuid=any_uuid&genreId=any_genre&languageId=any_language`
    )

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      {
        field: 'genreId',
        message: 'The genreId field must be a number',
      },
      {
        field: 'languageId',
        message: 'The languageId field must be a number',
      },
      {
        field: 'userUuid',
        message: 'The userUuid field must be a valid UUID',
      },
    ])
  })
})
