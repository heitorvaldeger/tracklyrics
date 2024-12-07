import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import { UserEmailStatus } from '#enums/user-email-status'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { OTPAdapter } from '#infra/crypto/protocols/otp-adapter'
import { RedisAdapter } from '#infra/db/cache/protocols/redis-adapter'
import { UserRepository } from '#infra/db/repository/protocols/user-repository'
import { AuthService } from '#services/auth/auth-service'
import { mockRegisterRequest } from '#tests/factories/mocks/mock-register-request'

export const mockUserRepositoryStub = () => {
  const userRepositoryStub: UserRepository = {
    getUserByEmailOrUsername: (payload: UserRepository.FindUserByEmailUsernameParams) =>
      Promise.resolve({
        uuid: 'any_uuid',
        username: 'any_username',
        email: 'any_email',
        password: 'any_password',
        emailStatus: UserEmailStatus.VERIFIED,
      }),
    create: (user: UserRepository.CreateParams) =>
      Promise.resolve({
        uuid: 'any_uuid',
        username: 'any_username',
        email: 'any_email',
        password: 'any_password',
        emailStatus: UserEmailStatus.UNVERIFIED,
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

const mockOTPAuthStub = (): OTPAdapter => ({
  create: (id) => Promise.resolve('any_code'),
  validate: (token: string) => Promise.resolve(true),
})

const mockRedisAdapter = (): RedisAdapter => ({
  set: (key, value) => Promise.resolve(),
})

const makeSut = () => {
  const userRepositoryStub = mockUserRepositoryStub()
  const otpAuthStub = mockOTPAuthStub()
  const redisAdapter = mockRedisAdapter()
  const sut = new AuthService(userRepositoryStub, otpAuthStub, redisAdapter)

  return { sut, userRepositoryStub }
}

test.group('Auth Service', () => {
  test('should return success on register if user not exist', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)
    const userRegisterModel = await sut.register(mockRegisterRequest())
    expect(userRegisterModel).toEqual(
      createSuccessResponse({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.UNVERIFIED,
      })
    )
  })

  test('should return fail on register if user email has been verified', async ({ expect }) => {
    const { sut } = makeSut()
    const mockUser = mockRegisterRequest()

    const userRegisterModel = await sut.register(mockUser)
    expect(userRegisterModel).toEqual(
      createFailureResponse(APPLICATION_MESSAGES.EMAIL_OR_USERNAME_ALREADY_USING)
    )
  })

  test('should return success on register if user exist and email has been unverified', async ({
    expect,
  }) => {
    const { sut, userRepositoryStub } = makeSut()
    const mockUser = mockRegisterRequest()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves({
      email: mockUser.email,
      username: mockUser.username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
    })

    const userRegisterModel = await sut.register(mockUser)
    expect(userRegisterModel).toEqual(
      createSuccessResponse({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.UNVERIFIED,
      })
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

  test('should return fail on login if user not found', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID))
  })

  test('should return fail on login if password is not equal', async ({ expect }) => {
    const { sut } = makeSut()
    stub(hash, 'verify').resolves(false)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID))
  })

  test('should return fail on login if email is pending validation', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const mockUser = mockRegisterRequest()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves({
      email: mockUser.email,
      username: mockUser.username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
    })

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(
      createFailureResponse(APPLICATION_MESSAGES.EMAIL_PENDING_VALIDATION)
    )
  })
})
