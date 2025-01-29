import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'

import { UserEmailStatus } from '#enums/user-email-status'
import { UserPostgresRepository } from '#infra/db/repository/postgres/user-postgres-repository'
import UserLucid from '#models/user-model/user-lucid'
import { UserWithoutPasswordModel } from '#models/user-model/user-without-password-model'

const makeSut = () => {
  const sut = new UserPostgresRepository()
  return { sut }
}

test.group('UserPostgresRepository', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return a user if email and username valid is provided', async ({ expect }) => {
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

  test('return a user if email or username valid is provided', async ({ expect }) => {
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

  test('return a null if email and username not valid is provided', async ({ expect }) => {
    const { sut } = makeSut()
    const user = await sut.getUserByEmailOrUsername({
      username: 'any_username',
      email: 'any_email@mail.com',
    })

    expect(user).toBeFalsy()
  })

  test('return a null if email and username is not provided', async ({ expect }) => {
    const { sut } = makeSut()
    const user = await sut.getUserByEmailOrUsername({})

    expect(user).toBeFalsy()
  })

  test('return a user if created on success', async ({ expect }) => {
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

  test('return a valid token if successful', async ({ expect }) => {
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

  test('delete all tokens from user', async ({ expect }) => {
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

  test('update email status from user', async ({ expect }) => {
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

  test('return null on getUserByEmailWithoutPassword if emailAddress is not provided', async ({
    expect,
  }) => {
    const { sut } = makeSut()

    const user = await sut.getUserByEmailWithoutPassword('')
    expect(user).toBeFalsy()
  })

  test('return user on getUserByEmailWithoutPassword if emailAddress is provided', async ({
    expect,
  }) => {
    const { sut } = makeSut()

    const fakeUser = await UserLucid.create({
      uuid: randomUUID(),
      username: 'valid_username',
      email: 'valid_mail@mail.com',
      password: 'valid_password',
      firstName: 'valid_firstName',
      lastName: 'valid_lastName',
    })

    const { uuid, username, email, emailStatus, firstName, lastName } = (
      await UserLucid.findBy('uuid', fakeUser.uuid)
    )?.serialize({
      fields: {
        omit: ['password'],
      },
    }) as UserWithoutPasswordModel

    const user = await sut.getUserByEmailWithoutPassword('valid_mail@mail.com')
    expect(user).toEqual({
      uuid,
      username,
      email,
      emailStatus,
      firstName,
      lastName,
    })
  })
})
