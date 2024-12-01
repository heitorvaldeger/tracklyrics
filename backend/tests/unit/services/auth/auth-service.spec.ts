import { test } from '@japa/runner'
import { AuthService } from '#services/auth/auth-service'
import sinon, { SinonStub, stub } from 'sinon'
import { UserRepository } from '#repository/protocols/user-repository'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { mockUserRegisterRequest } from '#tests/factories/fakes/mock-user-register-request'
import { AuthAdonisStrategy } from '#services/auth/strategy/auth-adonis-strategy'
import hash from '@adonisjs/core/services/hash'

export const mockUserRepositoryStub = () => {
  const userRepositoryStub: UserRepository = {
    getUserByEmailOrUsername: (payload: UserRepository.FindUserByEmailUsernameParams) =>
      Promise.resolve({
        uuid: 'any_uuid',
        username: 'any_username',
        email: 'any_email',
        password: 'any_password',
      }),
    create: (user: UserRepository.CreateParams) =>
      Promise.resolve({
        uuid: 'any_uuid',
        username: 'any_username',
        email: 'any_email',
        password: 'any_password',
      }),
    createAccessToken: (userUuid: string) =>
      Promise.resolve({
        type: 'any_type',
        token: 'any_token',
      }),
    deleteAllAccessToken: (userUuid: string) => Promise.resolve(),
  }

  return userRepositoryStub
}

const makeSut = () => {
  const authStrategyStub = sinon.createStubInstance(AuthAdonisStrategy)
  authStrategyStub.getUserId.returns(1)

  const userRepositoryStub = mockUserRepositoryStub()
  const sut = new AuthService(userRepositoryStub, authStrategyStub)

  return { sut, userRepositoryStub, authStrategyStub }
}

test.group('Auth Service', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns a user id valid on getUserId', async ({ expect }) => {
    const { sut } = makeSut()

    const userId = sut.getUserId()

    expect(userId).toBe(1)
  })

  test('should returns -1 on getUserId if auth property is null', async ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()
    authStrategyStub.getUserId.returns(-1)
    const userId = sut.getUserId()

    expect(userId).toBe(-1)
  })

  test('should return a token on register if user was register on success', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()

    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)

    const userAccessToken = await sut.register(mockUserRegisterRequest())
    expect(userAccessToken).toEqual(
      createSuccessResponse({
        type: 'any_type',
        token: 'any_token',
      })
    )
  })

  test('should return a fail on register if user already using', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const mockUser = mockUserRegisterRequest()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves({
      email: mockUser.email,
      username: mockUser.username,
      uuid: 'any_uuid',
      password: 'any_password',
    })

    const userAccessToken = await sut.register(mockUser)
    expect(userAccessToken).toEqual(
      createFailureResponse(APPLICATION_ERRORS.EMAIL_OR_USERNAME_ALREADY_USING)
    )
  })

  test('should return a token on login if user is valid', async ({ expect }) => {
    const { sut } = makeSut()
    stub(hash, 'verify').resolves(true)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(
      createSuccessResponse({
        type: 'any_type',
        token: 'any_token',
      })
    )
  })

  test('should return a fail on login if user not found', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(createFailureResponse(APPLICATION_ERRORS.CREDENTIALS_INVALID))
  })

  test('should return a fail on login if password is not equal', async ({ expect }) => {
    const { sut } = makeSut()
    stub(hash, 'verify').resolves(false)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(createFailureResponse(APPLICATION_ERRORS.CREDENTIALS_INVALID))
  })
})
