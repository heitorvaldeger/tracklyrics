import { test } from '@japa/runner'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import UserLucid from '#models/user-model/user-lucid'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'

test.group('User Routes', (group) => {
  test('/GET user information - it must return 401 on get user information if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.get('user')

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.UNAUTHORIZED)
  })

  test('/GET user information - it must return 200 on get user information with success', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', fakeUser.uuid)
    )
    const accessTokenValue = accessToken.value!.release()

    const response = await client.get('user').bearerToken(accessTokenValue)

    const body = response.body()

    expect(response.status()).toBe(200)
    expect(body).toBeTruthy()
    expect(body.username).toBe(fakeUser.username)
    expect(body.firstName).toBe(fakeUser.firstName)
  })
})
