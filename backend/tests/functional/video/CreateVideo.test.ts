import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'

test.group('Video/CreateVideoRoute', () => {
  test('/POST videos/ - it must return 200 on create if video create on success', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeGenre, fakeLanguage } = await mockAllTables()

    const response = await client
      .post(`/videos`)
      .json({
        ...mockVideoCreateOrUpdateRequest,
        languageId: fakeLanguage.id,
        genreId: fakeGenre.id,
      })
      .loginAs(fakeUser)

    expect(response.status()).toBe(200)
    expect(response.body().artist).toBe(mockVideoCreateOrUpdateRequest.artist)
    expect(response.body().linkYoutube).toBe(mockVideoCreateOrUpdateRequest.linkYoutube)
    expect(response.body().title).toBe(mockVideoCreateOrUpdateRequest.title)
    expect(response.body().releaseYear).toBe(mockVideoCreateOrUpdateRequest.releaseYear)
  })

  test('/POST videos/ - it must return 400 on create if any param is invalid', async ({
    client,
    expect,
  }) => {
    const { fakeUser, fakeLanguage } = await mockAllTables()
    const { genreId, artist, ...rest } = mockVideoCreateOrUpdateRequest

    const response = await client
      .post(`/videos`)
      .json({
        ...rest,
        languageId: fakeLanguage.id,
      })
      .loginAs(fakeUser)

    expect(response.status()).toBe(400)
    expect(response.body()).toEqual({
      code: 'E_VALIDATION_ERROR',
      errors: [
        { error: 'Required', field: 'artist' },
        { error: 'Required', field: 'genreId' },
      ],
    })
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
    const { genreId, languageId, ...rest } = mockVideoCreateOrUpdateRequest

    const response = await client
      .post(`/videos`)
      .json({
        ...rest,
        linkYoutube: fakeVideo.linkYoutube,
        languageId: fakeLanguage.id,
        genreId: fakeGenre.id,
      })
      .loginAs(fakeUser)

    expect(response.status()).toBe(409)
    expect(response.body().code).toBe('E_YOUTUBE_LINK_ALREADY_EXISTS')
  })
})
