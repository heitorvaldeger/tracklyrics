import hash from '@adonisjs/core/services/hash'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

import { UserEmailStatus } from '#enums/user-email-status'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import UserLucid from '#models/user-model/user-lucid'

test.group('Auth Login Route', (group) => {
  test('/POST login/ - should return 200 on login user with success', async ({
    client,
    expect,
  }) => {
    const password = faker.internet.password()
    const fakeUser = await UserLucid.create({
      username: faker.internet.username(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: await hash.make(password),
      emailStatus: UserEmailStatus.VERIFIED,
    })

    const response = await client.post(`/login`).fields({
      email: fakeUser.email,
      password,
    })

    expect(response.status()).toBe(200)
    expect(response.body().type).toBe('auth_token')
    expect(response.body().token).toBeTruthy()
  })

  test('/POST login/ - should return 400 on login if any param is invalid', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/login`).fields({})

    expect(response.status()).toBe(400)
    expect(Array.isArray(response.body())).toBeTruthy()
  })

  test('/POST login/ - should return 401 on login if credentials is invalid', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/login`).fields({
      email: faker.internet.email(),
      password: 'any_password',
    })

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.CREDENTIALS_INVALID)
  })

  test('/POST login/ - should return 401 on login if password is not equal', async ({
    client,
    expect,
  }) => {
    const password = faker.internet.password()
    const fakeUser = await UserLucid.create({
      username: faker.internet.username(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: await hash.make(password),
      emailStatus: UserEmailStatus.VERIFIED,
    })

    const response = await client.post(`/login`).fields({
      email: fakeUser.email,
      password: 'any_password',
    })

    expect(response.status()).toBe(401)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.CREDENTIALS_INVALID)
  })

  test('/POST login/ - should return 422 on login if email user is unverified', async ({
    client,
    expect,
  }) => {
    const password = faker.internet.password()
    const fakeUser = await UserLucid.create({
      username: faker.internet.username(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: await hash.make(password),
    })

    const response = await client.post(`/login`).fields({
      email: fakeUser.email,
      password,
    })

    expect(response.status()).toBe(422)
    expect(response.body()).toEqual(APPLICATION_MESSAGES.EMAIL_PENDING_VALIDATION)
  })
})
