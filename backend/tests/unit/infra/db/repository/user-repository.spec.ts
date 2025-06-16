import { randomUUID } from 'node:crypto'

import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

import { UserWithoutPassword } from '#core/infra/db/repository/interfaces/user-repository'
import { UserPostgresRepository } from '#core/infra/db/repository/user-repository'
import { UserEmailStatus } from '#enums/user-email-status'
import { User } from '#models/user'
import { mockUser } from '#tests/__mocks__/db/mock-user'

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
    const fakeUser = await mockUser()
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
    const fakeUser = await mockUser()

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

  test('update email status from user', async ({ expect }) => {
    const { sut } = makeSut()

    const fakeUser = await mockUser()

    await sut.updateEmailStatus(fakeUser.uuid)

    const userUpdated = await User.query().where('uuid', fakeUser.uuid).first()

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

    const fakeUser = await mockUser()

    const { uuid, username, email, emailStatus, firstName, lastName } = (
      await User.findBy('uuid', fakeUser.uuid)
    )?.serialize({
      fields: {
        omit: ['password'],
      },
    }) as UserWithoutPassword

    const user = await sut.getUserByEmailWithoutPassword(fakeUser.email)
    expect(user).toEqual({
      uuid,
      username,
      email,
      emailStatus,
      firstName,
      lastName,
    })
  })

  test('update password from user', async ({ expect }) => {
    const { sut } = makeSut()

    const fakeUser = await mockUser()

    await sut.updatePassword(fakeUser.uuid, 'any_value')

    const userUpdated = await User.query().where('uuid', fakeUser.uuid).first()

    expect(userUpdated?.password).toBe('any_value')
  })
})
