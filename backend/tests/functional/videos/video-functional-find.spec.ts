import { APPLICATION_ERRORS } from '#helpers/application-errors'
import GenreLucid from '#models/genre-model/genre-lucid'
import { LanguageLucid } from '#models/language-model/language-lucid'
import Favorite from '#models/lucid-orm/favorite'
import UserLucid from '#models/user-model/user-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { mockVideoEntity } from '#tests/factories/fakes/mock-video-entity'
import { NilUUID } from '#tests/utils/NilUUID'
import { test } from '@japa/runner'

const fieldsToOmit = ['userId', 'languageId', 'genreId', 'id']
test.group('Video Find Route', (group) => {
  group.each.setup(async () => {
    await Favorite.query().del()
    await VideoLucid.query().del()
    await UserLucid.query().del()
    await GenreLucid.query().del()
    await LanguageLucid.query().del()
  })

  test('/GET videos/{uuid} - should return 200 on search video by uuid', async ({
    client,
    expect,
  }) => {
    const { fakeGenre, fakeLanguage, fakeUser, fakeVideo } = await mockVideoEntity()

    const response = await client.get(`/videos/${fakeVideo.uuid}`)

    expect(response.status()).toBe(200)
    expect(response.body()).toEqual({
      ...fakeVideo.serialize({
        fields: {
          omit: fieldsToOmit,
        },
      }),
      genre: fakeGenre.name,
      language: fakeLanguage.name,
      username: fakeUser.username,
    })
  })

  test('/GET videos/{uuid} - should return 400 on search if video uuid invalid is provided', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos/any_uuid`)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual([
      { field: 'uuid', message: 'The uuid field must be a valid UUID' },
    ])
  })

  test('/GET videos/{uuid} - should return 404 on search if video uuid not exists', async ({
    client,
    expect,
  }) => {
    const response = await client.get(`/videos/${NilUUID}`)

    expect(response.status()).toBe(404)
    expect(response.body()).toEqual(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
  })
})
