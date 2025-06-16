import hash from '@adonisjs/core/services/hash'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

import { UserEmailStatus } from '#enums/user-email-status'
import { User } from '#models/user'

test.group('Auth Login Route', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('/POST login/ - return 204 on login user with success', async ({ client, expect }) => {
    const password = faker.internet.password()
    const fakeUser = await User.create({
      username: faker.internet.username(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password,
      emailStatus: UserEmailStatus.VERIFIED,
    })

    const response = await client.post(`/login`).fields({
      email: fakeUser.email,
      password,
    })

    expect(response.status()).toBe(204)
  })

  test('/POST login/ - return 400 on login if any param is invalid', async ({ client, expect }) => {
    const response = await client.post(`/login`).fields({})

    expect(response.status()).toBe(400)
    expect(Array.isArray(response.body())).toBeTruthy()
  })

  test('/POST login/ - return 401 on login if credentials is invalid', async ({
    client,
    expect,
  }) => {
    const response = await client.post(`/login`).fields({
      email: faker.internet.email(),
      password: 'any_password',
    })

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_INVALID_CREDENTIALS')
  })

  test('/POST login/ - return 401 on login if password is not equal', async ({
    client,
    expect,
  }) => {
    const password = faker.internet.password()
    const fakeUser = await User.create({
      username: faker.internet.username(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password,
      emailStatus: UserEmailStatus.VERIFIED,
    })

    const response = await client.post(`/login`).fields({
      email: fakeUser.email,
      password: 'any_password',
    })

    expect(response.status()).toBe(401)
    expect(response.body().code).toBe('E_INVALID_CREDENTIALS')
  })

  test('/POST login/ - return 422 on login if email user is unverified', async ({
    client,
    expect,
  }) => {
    const password = faker.internet.password()
    const fakeUser = await User.create({
      username: faker.internet.username(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password,
    })

    const response = await client.post(`/login`).fields({
      email: fakeUser.email,
      password,
    })

    expect(response.status()).toBe(422)
    expect(response.body().code).toBe('E_EMAIL_PENDING_VALIDATION')
  })
})
