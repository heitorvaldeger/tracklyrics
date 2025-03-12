import { test } from '@japa/runner'

import { UserEmailStatus } from '#enums/user-email-status'
import { mockAuthRegisterData } from '#tests/__mocks__/stubs/mock-auth-stub'

test.group('Auth Register Route', (group) => {
  test('/POST register/ - it must return 200 on register user with success', async ({
    client,
    expect,
  }) => {
    const registerParams = mockAuthRegisterData()
    const response = await client.post(`/register`).fields(registerParams)

    expect(response.status()).toBe(200)
    expect(response.body().uuid).toBeTruthy()
    expect(response.body().emailStatus).toBe(UserEmailStatus.UNVERIFIED)
  })

  test('/POST register/ - it must return 400 on register if any param is invalid', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/register`).fields({})

    expect(response.status()).toBe(400)
    expect(Array.isArray(response.body())).toBeTruthy()
  })
})
