import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'

const ROUTE_PATH = 'user/update-password'

test.group('User/UpdatePasswordRoutes', () => {
  test('/PATCH update-password - it must return 401 on update password when user is unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.patch(ROUTE_PATH)

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })

  test('/PATCH update-password - it must return 400 on update password when password field is invalid', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()
    const response = await client
      .patch(ROUTE_PATH)
      .json({
        password: '',
      })
      .loginAs(fakeUser)

    expect(response.status()).toBe(400)
  })

  test('/PATCH update-password/ - it must return 200 on update password with success', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const response = await client
      .patch(ROUTE_PATH)
      .json({
        password: 'any_password',
      })
      .loginAs(fakeUser)

    const body = response.body()

    expect(response.status()).toBe(204)
    expect(body).toBeTruthy()
  })
})
