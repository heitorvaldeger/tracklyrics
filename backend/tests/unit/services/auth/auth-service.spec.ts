import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'
import Sinon, { stub } from 'sinon'

import { UserEmailStatus } from '#enums/user-email-status'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { HashAdapter } from '#infra/crypto/protocols/hash-adapter'
import { OTPAdapter } from '#infra/crypto/protocols/otp-adapter'
import { CacheAdapter } from '#infra/db/cache/protocols/cache-adapter'
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
    updateEmailStatus: (userUuid: string) => Promise.resolve(),
  }

  return userRepositoryStub
}

const mockOTPAdapterStub = (): OTPAdapter => ({
  createOTP: (id) => Promise.resolve('any_value'),
  validateOTP: (token: string) => Promise.resolve(true),
})

const mockHashAdapterStub = (): HashAdapter => ({
  createHash: (value) => Promise.resolve('any_value'),
  validateHash: (hashedValue, plainValue) => Promise.resolve(true),
})

const mockCacheAdapter = (): CacheAdapter => ({
  set: (key, value) => Promise.resolve(),
  get: (key: string) => Promise.resolve('any_value'),
})

const makeSut = () => {
  const userRepositoryStub = mockUserRepositoryStub()
  const otpAdapterStub = mockOTPAdapterStub()
  const hashAdapterStub = mockHashAdapterStub()
  const cacheAdapterStub = mockCacheAdapter()
  const sut = new AuthService(userRepositoryStub, otpAdapterStub, hashAdapterStub, cacheAdapterStub)

  return { sut, userRepositoryStub, cacheAdapterStub, otpAdapterStub, hashAdapterStub }
}

test.group('Auth Service', () => {
  test('it must return success on register if user not exist', async ({ expect }) => {
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

  test('it must return fail on register if user email has been verified', async ({ expect }) => {
    const { sut } = makeSut()
    const mockUser = mockRegisterRequest()

    const userRegisterModel = await sut.register(mockUser)
    expect(userRegisterModel).toEqual(
      createFailureResponse(APPLICATION_MESSAGES.EMAIL_OR_USERNAME_ALREADY_USING)
    )
  })

  test('it must return success on register if user exist and email has been unverified', async ({
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

  test('it must return a token on login if user is valid', async ({ expect }) => {
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

  test('it must return fail on login if user not found', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID))
  })

  test('it must return fail on login if password is not equal', async ({ expect }) => {
    const { sut, hashAdapterStub } = makeSut()
    stub(hashAdapterStub, 'validateHash').resolves(false)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID))
  })

  test('it must return fail on login if email is pending validation', async ({ expect }) => {
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

  test('it must return fail on validate email if user email has been verified', async ({
    expect,
  }) => {
    const { sut } = makeSut()
    const { email } = mockRegisterRequest()

    const response = await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.EMAIL_HAS_BEEN_VERIFIED))
  })

  test('it must return fail on validate email if user not exists', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const { email } = mockRegisterRequest()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)

    const response = await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.EMAIL_INVALID))
  })

  test('it must return fail on validate email if user not exists', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const { email } = mockRegisterRequest()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)

    const response = await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.EMAIL_INVALID))
  })

  test('it must return fail on validate email if code OTP is not equal', async ({ expect }) => {
    const { sut, cacheAdapterStub, userRepositoryStub } = makeSut()
    const { email, username } = mockRegisterRequest()

    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves({
      email,
      username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
    })
    stub(cacheAdapterStub, 'get').resolves('other_value')

    const response = await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.CODE_OTP_INVALID))
  })

  test('it must call UserRepository.updateEmailStatus on validate email with correct values', async ({
    expect,
  }) => {
    const { sut, userRepositoryStub } = makeSut()
    const { email, username } = mockRegisterRequest()

    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves({
      email,
      username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
    })

    const updateEmailStatusSpy = stub(userRepositoryStub, 'updateEmailStatus')

    await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(updateEmailStatusSpy.calledWith('any_uuid')).toBeTruthy()
  })

  test('it must return success on validate email', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const { email, username } = mockRegisterRequest()

    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves({
      email,
      username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
    })

    const response = await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).toEqual(
      createSuccessResponse({
        emailStatus: UserEmailStatus.VERIFIED,
        uuid: 'any_uuid',
      })
    )
  })
})
