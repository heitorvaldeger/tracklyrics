import { test } from '@japa/runner'

import { mockAllTables, mockVideo } from '#tests/__mocks__/db/mock-all'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'

test.group('Video Update Route', () => {
  test('/PUT videos/:uuid - it must return 200 on update if video update on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeGenre, fakeLanguage, fakeVideo } = await mockAllTables()

    const response = await client
      .put(`/videos/${fakeVideo.uuid}`)
      .json({
        ...mockVideoCreateOrUpdateRequest,
        languageId: fakeLanguage.id,
        genreId: fakeGenre.id,
      })
      .loginAs(fakeUser)

    expect(response.status()).toBe(200)
  })

  test('/PUT videos/:uuid - it must return 400 on update if any param is invalid', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeLanguage, fakeVideo } = await mockAllTables()
    const { genreId, artist, ...rest } = mockVideoCreateOrUpdateRequest

    const response = await client
      .put(`/videos/${fakeVideo.uuid}`)
      .json({
        ...rest,
        languageId: fakeLanguage.id,
      })
      .loginAs(fakeUser)

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

  test('/PUT videos/:uuid - it must return 401 on update if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/videos`).fields({})

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })

  test("/PUT videos/:uuid - it must return 422 on update if youtube URL video provided already exists and doesn't belong the video provided", async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeLanguage, fakeVideo, fakeGenre } = await mockAllTables()
    const anotherFakeVideo = await mockVideo({ fakeGenre, fakeLanguage, fakeUser })

    const { genreId, languageId, ...rest } = mockVideoCreateOrUpdateRequest

    const response = await client
      .put(`/videos/${fakeVideo.uuid}`)
      .json({
        ...rest,
        linkYoutube: anotherFakeVideo.linkYoutube,
        languageId: fakeLanguage.id,
        genreId: fakeGenre.id,
      })
      .loginAs(fakeUser)

    expect(response.status()).toBe(409)
    expect(response.body().code).toBe('E_YOUTUBE_LINK_ALREADY_EXISTS')
  })
})
