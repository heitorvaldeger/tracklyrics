import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'

test.group('Video FindBy Route', (group) => {
  test('/GET videos?{genreId} - it must return a list videos if genreId is provided', async ({
    client,
    expect,
  }) => {
    const { fakeGenre } = await mockAllTables()
    await mockAllTables()

    const response = await client.get(`/videos?genreId=${fakeGenre.id}`)

    expect(response.status()).toBe(200)
    expect(response.body().length).toBe(1)
  })

  test('/GET videos?{userUuid} - it must return a list videos if userUuid is provided', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()
    await mockAllTables()

    const response = await client.get(`/videos?userUuid=${fakeUser.uuid}`)

    expect(response.status()).toBe(200)
    expect(response.body().length).toBe(1)
  })

  test('/GET videos - it must return a list videos if none params is provided', async ({
    client,
    expect,
  }) => {
    await mockAllTables()
    await mockAllTables()

    const response = await client.get(`/videos`)

    expect(response.status()).toBe(200)
    expect(response.body().length).toBe(2)
  })

  test('/GET videos - it must return 400 if invalid params is provided', async ({
    client,
    expect,
  }) => {
    await mockAllTables()
    await mockAllTables()

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
