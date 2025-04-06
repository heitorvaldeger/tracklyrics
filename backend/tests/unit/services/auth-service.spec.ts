import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import { UserEmailStatus } from '#enums/user-email-status'
import CodeOtpInvalidException from '#exceptions/code-otp-invalid-exception'
import EmailHasBeenVerifiedException from '#exceptions/email-has-been-verified-exception'
import EmailInvalidException from '#exceptions/email-invalid-exception'
import EmailPendingValidationException from '#exceptions/email-pending-validation-exception'
import InvalidCredentialsException from '#exceptions/invalid-credentials-exception'
import UserOrEmailAlreadyUsingException from '#exceptions/user-or-email-already-using-exception'
import { IHashAdapter } from '#infra/crypto/interfaces/hash-adapter'
import { IOTPAdapter } from '#infra/crypto/interfaces/otp-adapter'
import { ICacheAdapter } from '#infra/db/cache/interfaces/cache-adapter'
import { AuthService } from '#services/auth-service'
import { mockAuthRegisterData } from '#tests/__mocks__/stubs/mock-auth-stub'
import { mockUserRepository } from '#tests/__mocks__/stubs/mock-user-stub'

const mockOTPAdapterStub = (): IOTPAdapter => ({
  createOTP: () => Promise.resolve('any_value'),
  validateOTP: () => Promise.resolve(true),
})

const mockHashAdapterStub = (): IHashAdapter => ({
  createHash: () => Promise.resolve('any_value'),
  validateHash: () => Promise.resolve(true),
})

const mockCacheAdapter = (): ICacheAdapter => ({
  set: () => Promise.resolve(),
  get: () => Promise.resolve('any_value'),
  delete: () => Promise.resolve(),
})

const makeSut = () => {
  const otpAdapterStub = mockOTPAdapterStub()
  const hashAdapterStub = mockHashAdapterStub()
  const cacheAdapterStub = mockCacheAdapter()
  const sut = new AuthService(mockUserRepository, otpAdapterStub, hashAdapterStub, cacheAdapterStub)

  return {
    sut,
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
    const { sut } = makeSut()
    stub(mockUserRepository, 'getUserByEmailOrUsername').resolves(null)
    const userRegisterModel = await sut.register(mockAuthRegisterData())
    expect(userRegisterModel).toEqual({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.UNVERIFIED,
    })
  })

  test('return fail on register if user email has been verified', async ({ expect }) => {
    const { sut } = makeSut()
    const mockUser = mockAuthRegisterData()

    const userRegisterModel = sut.register(mockUser)
    expect(userRegisterModel).rejects.toEqual(new UserOrEmailAlreadyUsingException())
  })

  test('return success on register if user exist and email has been unverified', async ({
    expect,
  }) => {
    const { sut } = makeSut()
    const mockUser = mockAuthRegisterData()
    stub(mockUserRepository, 'getUserByEmailOrUsername').resolves({
      email: mockUser.email,
      username: mockUser.username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
      firstName: 'any_firstname',
      lastName: 'any_lastname',
    })

    const userRegisterModel = await sut.register(mockUser)
    expect(userRegisterModel).toEqual({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.UNVERIFIED,
    })
  })

  test('return a token on login if user is valid', async ({ expect }) => {
    const { sut } = makeSut()
    stub(hash, 'verify').resolves(true)

    const userAccessToken = await sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).toEqual({
      type: 'any_type',
      token: 'any_token',
      expiresAt: new Date(2000, 0, 1),
    })
  })

  test('return fail on login if user not found', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockUserRepository, 'getUserByEmailOrUsername').resolves(null)

    const userAccessToken = sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).rejects.toEqual(new InvalidCredentialsException())
  })

  test('return fail on login if password is not equal', async ({ expect }) => {
    const { sut, hashAdapterStub } = makeSut()
    stub(hashAdapterStub, 'validateHash').resolves(false)

    const userAccessToken = sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).rejects.toEqual(new InvalidCredentialsException())
  })

  test('return fail on login if email is pending validation', async ({ expect }) => {
    const { sut } = makeSut()
    const mockUser = mockAuthRegisterData()
    stub(mockUserRepository, 'getUserByEmailOrUsername').resolves({
      email: mockUser.email,
      username: mockUser.username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
      firstName: 'any_firstname',
      lastName: 'any_lastname',
    })

    const userAccessToken = sut.login({
      email: 'any_email',
      password: 'any_password',
    })
    expect(userAccessToken).rejects.toEqual(new EmailPendingValidationException())
  })

  test('return fail on validate email if user email has been verified', async ({ expect }) => {
    const { sut } = makeSut()
    const { email } = mockAuthRegisterData()

    const response = sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).rejects.toEqual(new EmailHasBeenVerifiedException())
  })

  test('return fail on validate email if user not exists', async ({ expect }) => {
    const { sut } = makeSut()
    const { email } = mockAuthRegisterData()
    stub(mockUserRepository, 'getUserByEmailOrUsername').resolves(null)

    const response = sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).rejects.toEqual(new EmailInvalidException())
  })

  test('return fail on validate email if user not exists', async ({ expect }) => {
    const { sut } = makeSut()
    const { email } = mockAuthRegisterData()
    stub(mockUserRepository, 'getUserByEmailOrUsername').resolves(null)

    const response = sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).rejects.toEqual(new EmailInvalidException())
  })

  test('return fail on validate email if code OTP is not equal', async ({ expect }) => {
    const { sut, cacheAdapterStub } = makeSut()
    const { email, username } = mockAuthRegisterData()

    stub(mockUserRepository, 'getUserByEmailOrUsername').resolves({
      email,
      username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
      firstName: 'any_firstname',
      lastName: 'any_lastname',
    })
    stub(cacheAdapterStub, 'get').resolves('other_value')

    const response = sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).rejects.toEqual(new CodeOtpInvalidException())
  })

  test('call IUserRepository.updateEmailStatus on validate email with correct values', async ({
    expect,
  }) => {
    const { sut } = makeSut()
    const { email, username } = mockAuthRegisterData()

    stub(mockUserRepository, 'getUserByEmailOrUsername').resolves({
      email,
      username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
      firstName: 'any_firstname',
      lastName: 'any_lastname',
    })

    const updateEmailStatusSpy = stub(mockUserRepository, 'updateEmailStatus')

    await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(updateEmailStatusSpy.calledWith('any_uuid')).toBeTruthy()
  })

  test('return success on validate email', async ({ expect }) => {
    const { sut } = makeSut()
    const { email, username } = mockAuthRegisterData()

    stub(mockUserRepository, 'getUserByEmailOrUsername').resolves({
      email,
      username,
      uuid: 'any_uuid',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
      firstName: 'any_firstname',
      lastName: 'any_lastname',
    })

    const response = await sut.validateEmail({
      email,
      codeOTP: 'any_value',
    })
    expect(response).toEqual({
      emailStatus: UserEmailStatus.VERIFIED,
      uuid: 'any_uuid',
    })
  })
})
