import redis from '@adonisjs/redis/services/main'
import { test } from '@japa/runner'

import { mockAllTables } from '#tests/__mocks__/db/mock-all'

const ROUTE_PATH = 'user/validate-update-password'

test.group('User/UpdatePasswordRoutes', () => {
  test('/PATCH validate-update-password - it must return 401 on validation update password when user is unauthorized', async ({
    client,
    expect,
  }) => {
    const response = await client.patch(ROUTE_PATH)

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_UNAUTHORIZED_ACCESS')
  })

  test('/PATCH validate-update-password - it must return 400 on validation update password when codeOTP field is invalid', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()
    const response = await client
      .patch(ROUTE_PATH)
      .json({
        codeOTP: '',
      })
      .loginAs(fakeUser)

    expect(response.status()).toBe(400)
  })

  test("/PATCH validate-update-password/ - it must return 422 on validation update password when code OTP doesn't exists", async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    const response = await client
      .patch(ROUTE_PATH)
      .json({
        codeOTP: '123456',
      })
      .loginAs(fakeUser)

    expect(response.status()).toBe(422)
    expect(response.body().code).toBe('E_CODE_OTP_INVALID')
  })

  test('/PATCH validate-update-password/ - it must return 200 on validation update password with success', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    await redis.set(
      `${fakeUser.uuid}-update-password`,
      JSON.stringify({
        codeOTP: '123456',
        password: 'any_password',
      })
    )
    const response = await client
      .patch(ROUTE_PATH)
      .json({
        codeOTP: '123456',
      })
      .loginAs(fakeUser)

    expect(response.status()).toBe(204)
    expect(response.body()).toBeTruthy()
  })
})
