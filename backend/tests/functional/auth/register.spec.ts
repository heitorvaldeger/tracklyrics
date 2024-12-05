import { test } from '@japa/runner'

import { mockUserRegisterRequest } from '#tests/factories/fakes/mock-user-register-request'

test.group('Auth Register Route', () => {
  test('/POST register/ - should return 200 on register user with success', async ({
    client,
    expect,
  }) => {
    const userParams = mockUserRegisterRequest()
    const response = await client.post(`/register`).fields(userParams)

    expect(response.status()).toBe(200)
    expect(response.body().type).toBe('auth_token')
    expect(response.body().token).toBeTruthy()
  })

  test('/POST register/ - should return 400 on register if any param is invalid', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/register`).fields({})

    expect(response.status()).toBe(400)
    expect(Array.isArray(response.body())).toBeTruthy()
  })
})
