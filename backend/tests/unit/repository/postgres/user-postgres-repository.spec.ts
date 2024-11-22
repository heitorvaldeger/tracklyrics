import { test } from '@japa/runner'
import { UserPostgresRepository } from '#repository/postgres/user-postgres-repository'
import AuthAccessTokenLucid from '#models/auth-access-token/auth-access-token-lucid'
import { randomUUID } from 'node:crypto'
import VideoLucid from '#models/video/video-lucid'
import UserLucid from '#models/user/user-lucid'

const makeSut = () => {
  const sut = new UserPostgresRepository()
  return { sut }
}

test.group('UserPostgresRepository', (group) => {
  group.each.setup(async () => {
    await VideoLucid.query().delete()
    await UserLucid.query().delete()
    await AuthAccessTokenLucid.query().delete()
  })

  test('should return a user if email and username valid is provided', async ({ expect }) => {
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

  test('should return a user if email or username valid is provided', async ({ expect }) => {
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

  test('should return a null if email and username not valid is provided', async ({ expect }) => {
    const { sut } = makeSut()
    const user = await sut.getUserByEmailOrUsername({
      username: 'any_username',
      email: 'any_email@mail.com',
    })

    expect(user).toBeFalsy()
  })

  test('should return a null if email and username is not provided', async ({ expect }) => {
    const { sut } = makeSut()
    const user = await sut.getUserByEmailOrUsername({})

    expect(user).toBeFalsy()
  })

  test('should return a user if created on success', async ({ expect }) => {
    const { sut } = makeSut()
    const uuid = randomUUID()
    const fakeUser = {
      uuid,
      username: 'valid_username',
      email: 'valid_mail@mail.com',
      password: 'valid_password',
      firstName: 'valid_firstName',
      lastName: 'valid_lastName',
    }
    const user = await sut.create(fakeUser)

    expect(user).toBeTruthy()
    expect(fakeUser.uuid).toBe(uuid)
  })

  test('should return a valid token if successful', async ({ expect }) => {
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
    const accessToken = await sut.createAccessToken({
      uuid: fakeUser.uuid,
    })

    expect(accessToken).toBeTruthy()
    expect(accessToken.type).toBe('auth_token')
    expect(accessToken.token.startsWith('oat', 0)).toBeTruthy()
  })
})
