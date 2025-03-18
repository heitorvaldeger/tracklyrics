import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { UserEmailStatus } from '#enums/user-email-status'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { HashAdapter } from '#infra/crypto/_protocols/hash-adapter'
import { OTPAdapter } from '#infra/crypto/_protocols/otp-adapter'
import { CacheAdapter } from '#infra/db/cache/_protocols/cache-adapter'
import { AuthService } from '#services/auth-service'
import { mockAuthStrategyStub } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockAuthRegisterData } from '#tests/__mocks__/stubs/mock-auth-stub'
import { mockUserRepositoryStub } from '#tests/__mocks__/stubs/mock-user-stub'

const mockOTPAdapterStub = (): OTPAdapter => ({
  createOTP: () => Promise.resolve('any_value'),
  validateOTP: () => Promise.resolve(true),
})

const mockHashAdapterStub = (): HashAdapter => ({
  createHash: () => Promise.resolve('any_value'),
  validateHash: () => Promise.resolve(true),
})

const mockCacheAdapter = (): CacheAdapter => ({
  set: () => Promise.resolve(),
  get: () => Promise.resolve('any_value'),
  delete: () => Promise.resolve(),
})

const makeSut = () => {
  const userRepositoryStub = mockUserRepositoryStub()
  const otpAdapterStub = mockOTPAdapterStub()
  const hashAdapterStub = mockHashAdapterStub()
  const cacheAdapterStub = mockCacheAdapter()
  const sut = new AuthService(userRepositoryStub, otpAdapterStub, hashAdapterStub, cacheAdapterStub)

  return {
    sut,
    userRepositoryStub,
    cacheAdapterStub,
    otpAdapterStub,
    hashAdapterStub,
  }
}

test.group('Auth Service', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })
  test('return success on register if user not exist', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)
    const userRegisterModel = await sut.register(mockAuthRegisterData())
    expect(userRegisterModel).toEqual(
      createSuccessResponse({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.UNVERIFIED,
      })
    )
  })

  test('return fail on register if user email has been verified', async ({ expect }) => {
    const { sut } = makeSut()
    const mockUser = mockAuthRegisterData()

    const userRegisterModel = await sut.register(mockUser)
    expect(userRegisterModel).toEqual(
      createFailureResponse(APPLICATION_MESSAGES.EMAIL_OR_USERNAME_ALREADY_USING)
    )
  })

  test('return success on register if user exist and email has been unverified', async ({
    expect,
  }) => {
    const { sut, userRepositoryStub } = makeSut()
    const mockUser = mockAuthRegisterData()
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

  test('return a token on login if user is valid', async ({ expect }) => {
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
        expiresAt: new Date(2000, 0, 1),
      })
    )
  })

  test('return fail on login if user not found', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID))
  })

  test('return fail on login if password is not equal', async ({ expect }) => {
    const { sut, hashAdapterStub } = makeSut()
    stub(hashAdapterStub, 'validateHash').resolves(false)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual(createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID))
  })

  test('return fail on login if email is pending validation', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const mockUser = mockAuthRegisterData()
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

  test('return fail on validate email if user email has been verified', async ({ expect }) => {
    const { sut } = makeSut()
    const { email } = mockAuthRegisterData()

    const response = await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.EMAIL_HAS_BEEN_VERIFIED))
  })

  test('return fail on validate email if user not exists', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const { email } = mockAuthRegisterData()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)

    const response = await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.EMAIL_INVALID))
  })

  test('return fail on validate email if user not exists', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const { email } = mockAuthRegisterData()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').resolves(null)

    const response = await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.EMAIL_INVALID))
  })

  test('return fail on validate email if code OTP is not equal', async ({ expect }) => {
    const { sut, cacheAdapterStub, userRepositoryStub } = makeSut()
    const { email, username } = mockAuthRegisterData()

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

  test('call UserRepository.updateEmailStatus on validate email with correct values', async ({
    expect,
  }) => {
    const { sut, userRepositoryStub } = makeSut()
    const { email, username } = mockAuthRegisterData()

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

  test('return success on validate email', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const { email, username } = mockAuthRegisterData()

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
