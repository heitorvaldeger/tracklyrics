import Favorite from '#models/lucid-orm/favorite'
import UserLucid from '#models/user-model/user-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { mockFakeGenrer } from '#tests/factories/fakes/mock-fake-genrer'
import { mockFakeLanguage } from '#tests/factories/fakes/mock-fake-language'
import { mockFakeUser } from '#tests/factories/fakes/mock-fake-user'
import { makeYoutubeUrl } from '#tests/factories/makeYoutubeUrl'
import { NilUUID } from '#tests/utils/NilUUID'
import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'

test.group('Video Find Route', (group) => {
  group.each.setup(async () => {
    await Favorite.query().del()
    await VideoLucid.query().del()
    await UserLucid.query().del()
  })

  test('/GET videos/{uuid} - should return 200 on load video success', async ({
    client,
    expect,
  }) => {
    const videoUuid = randomUUID()
    const [genrer, language, user] = await Promise.all([
      mockFakeGenrer(),
      mockFakeLanguage(),
      mockFakeUser(),
    ])

    const fakeVideo = (
      await VideoLucid.create({
        isDraft: false,
        title: 'Youtube Music - Video Test',
        artist: 'From Youtube',
        qtyViews: 10000,
        releaseYear: '2012',
        linkYoutube: makeYoutubeUrl(),
        uuid: videoUuid,
        languageId: language.id,
        genrerId: genrer.id,
        userId: user.id,
      })
    ).serialize({
      fields: {
        omit: ['userId', 'languageId', 'genrerId', 'id'],
      },
    })
    const response = await client.get(`/videos/${videoUuid}`)

    expect(response.status()).toBe(200)
    expect(response.body()).toEqual({
      ...fakeVideo,
      genrer: genrer.name,
      language: language.name,
      username: user.username,
    })
  })

  test('/GET videos/{uuid} - should return 400 if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos/any_uuid`)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })

  test('/GET videos/{uuid} - should return 404 if video uuid is not provided', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos`)

    expect(response.status()).toBe(404)
  })

  test('/GET videos/{uuid} - should return 404 if video uuid not exists', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos/${NilUUID}`)

    expect(response.status()).toBe(404)
  })
})
