import { test } from '@japa/runner'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { UserEmailStatus } from '#enums/user-email-status'
import { Crypto } from '#infra/crypto/crypto'
import { RedisAdonis } from '#infra/db/cache/redis-adonis'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'

test.group('Auth Validate Email Route', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('/POST validate-email - return 200 on validate email with success', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()
    const redisAdapter = new RedisAdonis()
    const otpAdapter = new Crypto()

    const codeOTP = await otpAdapter.createOTP(fakeUser.uuid)
    await redisAdapter.set(`${fakeUser.uuid}_${fakeUser.email}`, codeOTP)

    const response = await client.post(`/validate-email`).fields({
      email: fakeUser.email,
      codeOTP,
    })

    expect(response.status()).toBe(200)
    expect(response.body().uuid).toBeTruthy()
    expect(response.body().emailStatus).toBe(UserEmailStatus.VERIFIED)
  })

  test('/POST validate-email - return 400 on validate email if any field is invalid', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/validate-email`).fields({})

    expect(response.status()).toBe(400)
    expect(Array.isArray(response.body())).toBeTruthy()
  })

  test('/POST validate-email - return 400 on validate email if any field is invalid', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()

    fakeUser.emailStatus = UserEmailStatus.VERIFIED
    fakeUser.save()

    const response = await client.post(`/validate-email`).fields({
      email: fakeUser.email,
      codeOTP: '123456',
    })

    expect(response.status()).toBe(422)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.EMAIL_HAS_BEEN_VERIFIED)
  })

  test('/POST validate-email - return 422 on validate email if email has been verified', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/validate-email`).fields({
      email: 'any_email@mail.com',
      codeOTP: '123456',
    })

    expect(response.status()).toBe(422)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.EMAIL_INVALID)
  })

  test('/POST validate-email - return 400 on validate email if user not exist', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/validate-email`).fields({
      email: 'any_email@mail.com',
      codeOTP: '123456',
    })

    expect(response.status()).toBe(422)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.EMAIL_INVALID)
  })

  test('/POST validate-email - return 400 on validate email if user not exist', async ({
    client,
    expect,
  }) => {
    const { fakeUser } = await mockAllTables()
    const redisAdapter = new RedisAdonis()
    const otpAdapter = new Crypto()

    const codeOTP = await otpAdapter.createOTP(fakeUser.uuid)
    await redisAdapter.set(`${fakeUser.uuid}_${fakeUser.email}`, codeOTP)

    const response = await client.post(`/validate-email`).fields({
      email: fakeUser.email,
      codeOTP: '123456',
    })

    expect(response.status()).toBe(422)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.CODE_OTP_INVALID)
  })
})
