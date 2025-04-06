import { test } from '@japa/runner'

import { User } from '#models/user'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'

test.group('User Routes', (group) => {
  test('/GET user information - it must return 401 on get user information if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.get('user')

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })

  test('/GET user information - it must return 200 on get user information with success', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const accessToken = await User.accessTokens.create(
      await User.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.get('user').withCookie('AUTH', accessTokenValue)

    const body = response.body()

    expect(response.status()).toBe(200)
    expect(body).toBeTruthy()
    expect(body.username).toBe(fakeUser.username)
    expect(body.firstName).toBe(fakeUser.firstName)
  })
})
