import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'

import { UserEmailStatus } from '#enums/user-email-status'
import { UserPostgresRepository } from '#infra/db/repository/postgres/user-postgres-repository'
import UserLucid from '#models/user-model/user-lucid'

const makeSut = () => {
  const sut = new UserPostgresRepository()
  return { sut }
}

test.group('UserPostgresRepository', (group) => {
  test('it must return a user if email and username valid is provided', async ({ expect }) => {
    const { sut } = makeSut()
    const fakeUser = await UserLucid.create({
      username: 'valid_username',
      email: 'valid_mail@mail.com',
      password: 'valid_password',
      firstName: 'valid_firstName',
      lastName: 'valid_lastName',
    })
    const user = await sut.getUserByEmailOrUsername({
      username: fakeUser.username,
      email: fakeUser.email,
    })

    expect(user).toBeTruthy()
    expect(user?.username).toBe(fakeUser.username)
    expect(user?.email).toBe(fakeUser.email)
  })

  test('it must return a user if email or username valid is provided', async ({ expect }) => {
    const { sut } = makeSut()
    const fakeUser = await UserLucid.create({
      username: 'valid_username',
      email: 'valid_mail@mail.com',
      password: 'valid_password',
      firstName: 'valid_firstName',
      lastName: 'valid_lastName',
    })
    const user = await sut.getUserByEmailOrUsername({
      username: fakeUser.username,
      email: 'any_email@mail.com',
    })

    expect(user).toBeTruthy()
    expect(user?.username).toBe(fakeUser.username)
    expect(user?.email).toBe(fakeUser.email)
  })

  test('it must return a null if email and username not valid is provided', async ({ expect }) => {
    const { sut } = makeSut()
    const user = await sut.getUserByEmailOrUsername({
      username: 'any_username',
      email: 'any_email@mail.com',
    })

    expect(user).toBeFalsy()
  })

  test('it must return a null if email and username is not provided', async ({ expect }) => {
    const { sut } = makeSut()
    const user = await sut.getUserByEmailOrUsername({})

    expect(user).toBeFalsy()
  })

  test('it must return a user if created on success', async ({ expect }) => {
    const { sut } = makeSut()
    const uuid = randomUUID()
    const fakeUser = {
      uuid,
      username: 'valid_username',
      email: 'valid_mail@mail.com',
      password: 'valid_password',
      firstName: 'valid_firstName',
      lastName: 'valid_lastName',
      emailStatus: UserEmailStatus.UNVERIFIED,
    }
    const user = await sut.create(fakeUser)

    expect(user).toBeTruthy()
    expect(user.uuid).toBe(uuid)
    expect(user.emailStatus).toBe(UserEmailStatus.UNVERIFIED)
  })

  test('it must return a valid token if successful', async ({ expect }) => {
    const { sut } = makeSut()
    const uuid = randomUUID()

    const fakeUser = await UserLucid.create({
      uuid,
      username: 'valid_username',
      email: 'valid_mail@mail.com',
      password: 'valid_password',
      firstName: 'valid_firstName',
      lastName: 'valid_lastName',
    })
    const accessToken = await sut.createAccessToken(fakeUser.uuid)

    expect(accessToken).toBeTruthy()
    expect(accessToken.type).toBe('auth_token')
    expect(accessToken.token.startsWith('oat', 0)).toBeTruthy()
  })

  test('it must delete all tokens from user', async ({ expect }) => {
    const { sut } = makeSut()
    const uuid = randomUUID()

    const fakeUser = await UserLucid.create({
      uuid,
      username: 'valid_username',
      email: 'valid_mail@mail.com',
      password: 'valid_password',
      firstName: 'valid_firstName',
      lastName: 'valid_lastName',
    })
    await UserLucid.accessTokens.create(fakeUser)
    await sut.deleteAllAccessToken(fakeUser.uuid)

    const accessTokens = await UserLucid.accessTokens.all(fakeUser)

    expect(accessTokens.length).toBe(0)
  })

  test('it must update email status from user', async ({ expect }) => {
    const { sut } = makeSut()
    const uuid = randomUUID()

    const fakeUser = await UserLucid.create({
      uuid,
      username: 'valid_username',
      email: 'valid_mail@mail.com',
      password: 'valid_password',
      firstName: 'valid_firstName',
      lastName: 'valid_lastName',
    })
    await sut.updateEmailStatus(fakeUser.uuid)

    const userUpdated = await UserLucid.query().where('uuid', fakeUser.uuid).first()

    expect(userUpdated?.emailStatus).toBe(UserEmailStatus.VERIFIED)
  })
})
