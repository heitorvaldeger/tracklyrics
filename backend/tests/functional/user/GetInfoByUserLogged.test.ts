import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'

const ROUTE_PATH = 'user/'

test.group('User/GetInfoByUserLoggedRoutes', () => {
  test('/GET user information - it must return 401 on get user information if user unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.get(ROUTE_PATH)

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })

  test('/GET user information - it must return 200 on get user information with success', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const response = await client.get(ROUTE_PATH).loginAs(fakeUser)

    const body = response.body()

    expect(response.status()).toBe(200)
    expect(body).toBeTruthy()
    expect(body.username).toBe(fakeUser.username)
    expect(body.firstName).toBe(fakeUser.firstName)
  })
})
