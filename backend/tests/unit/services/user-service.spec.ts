import { test } from '@japa/runner'
import { spy, stub } from 'sinon'

import { IHashAdapter } from '#core/infra/crypto/interfaces/hash-adapter'
import { IOTPAdapter } from '#core/infra/crypto/interfaces/otp-adapter'
import { ICacheAdapter } from '#core/infra/db/cache/interfaces/cache-adapter'
import { UserEmailStatus } from '#enums/user-email-status'
import CodeOtpInvalidException from '#exceptions/code-otp-invalid-exception'
import UserNotFoundException from '#exceptions/user-not-found-exception'
import { UserService } from '#services/user-service'
import { mockAuth } from '#tests/__mocks__/stubs/mock-auth-stub'
import { mockUserRepository } from '#tests/__mocks__/stubs/mock-user-stub'

const mockOTPAdapterStub = (): IOTPAdapter => ({
  createOTP: () => Promise.resolve('any_code'),
  validateOTP: () => Promise.resolve(true),
})

const mockHashAdapterStub = (): IHashAdapter => ({
  createHash: () => Promise.resolve('password_hashed'),
  validateHash: () => Promise.resolve(true),
})

const mockCacheAdapter = (): ICacheAdapter => ({
  set: () => Promise.resolve(),
  get: () =>
    Promise.resolve(
      JSON.stringify({
        codeOTP: 'any_code',
        password: 'any_password',
      })
    ),
  delete: () => Promise.resolve(),
})

const makeSut = () => {
  const hashStub = mockHashAdapterStub()
  const otpStub = mockOTPAdapterStub()
  const cacheStub = mockCacheAdapter()
  const { authStub } = mockAuth()
  const sut = new UserService(mockUserRepository, authStub, hashStub, otpStub, cacheStub)

  return { sut, authStub, hashStub, otpStub, cacheStub }
}

test.group('UserService.getFullInfoByUserLogged', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return user not found if user was not found', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockUserRepository, 'getUserByEmailWithoutPassword').resolves(null)
    const httpResponse = sut.getFullInfoByUserLogged()

    expect(httpResponse).rejects.toEqual(new UserNotFoundException())
  })

  test('return a full info by user logged with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.getFullInfoByUserLogged()

    expect(httpResponse).toEqual({
      uuid: 'any_uuid',
      username: 'any_username',
      email: 'any_email',
      emailStatus: UserEmailStatus.VERIFIED,
      firstName: 'any_firstname',
      lastName: 'any_lastname',
    })
  })

  test('return true if Auth.getUserEmail method was called', async ({ expect }) => {
    const { sut, authStub } = makeSut()
    const getUserEmail = authStub.getUserEmail
    await sut.getFullInfoByUserLogged()

    expect(getUserEmail.called).toBeTruthy()
  })

  test('call IUserRepository.getUserByEmailWithoutPassword with correct value on getFullInfoByUserLogged', async ({
    expect,
  }) => {
    const { sut } = makeSut()
    const getUserByEmailWithoutPasswordSpy = spy(
      mockUserRepository,
      'getUserByEmailWithoutPassword'
    )
    await sut.getFullInfoByUserLogged()

    expect(getUserByEmailWithoutPasswordSpy.calledWith('valid_email@mail.com')).toBeTruthy()
  })

  test('call IUserRepository.updatePassword with correct value on validateUpdatePassword', async ({
    expect,
  }) => {
    const { sut } = makeSut()
    const updatePasswordSpy = spy(mockUserRepository, 'updatePassword')
    await sut.validateUpdatePassword('any_code')

    expect(updatePasswordSpy.calledWith('any_uuid', 'any_password')).toBeTruthy()
  })

  test('return CodeOtpInvalidException if codeOTP provided is different codeOTP from cache on validateUpdatePassword', async ({
    expect,
  }) => {
    const { sut } = makeSut()
    const promise = sut.validateUpdatePassword('another_code')

    expect(promise).rejects.toEqual(new CodeOtpInvalidException())
  })

  test('call createHash with correct value on updatePassword', async ({ expect }) => {
    const { sut, hashStub } = makeSut()
    const createHashSpy = spy(hashStub, 'createHash')
    await sut.updatePassword('any_password')

    expect(createHashSpy.calledWith('any_password')).toBeTruthy()
  })

  test('call createOTP with correct value on updatePassword', async ({ expect }) => {
    const { sut, otpStub } = makeSut()
    const createOTPSpy = spy(otpStub, 'createOTP')
    await sut.updatePassword('any_password')

    expect(createOTPSpy.calledWith('any_uuid')).toBeTruthy()
  })

  test('call cache delete with correct value on updatePassword', async ({ expect }) => {
    const { sut, cacheStub } = makeSut()
    stub(cacheStub, 'get').resolves('any_value')
    const deleteSpy = spy(cacheStub, 'delete')
    await sut.updatePassword('any_password')

    expect(deleteSpy.calledWith(`any_uuid-update-password`)).toBeTruthy()
  })

  test('call cache set with correct values on updatePassword', async ({ expect }) => {
    const { sut, cacheStub } = makeSut()
    const setSpy = spy(cacheStub, 'set')
    await sut.updatePassword('any_password')

    expect(
      setSpy.calledWith(
        `any_uuid-update-password`,
        JSON.stringify({
          password: 'password_hashed',
          codeOTP: 'any_code',
        })
      )
    ).toBeTruthy()
  })
})
