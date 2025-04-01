import { test } from '@japa/runner'
import Sinon, { stub } from 'sinon'

import { UserEmailStatus } from '#enums/user-email-status'
import UnauthorizedException from '#exceptions/unauthorized-exception'
import UserNotFoundException from '#exceptions/user-not-found-exception'
import { UserService } from '#services/user-service'
import { mockAuth } from '#tests/__mocks__/stubs/mock-auth-stub'
import { mockUserRepository } from '#tests/__mocks__/stubs/mock-user-stub'

const makeSut = () => {
  const { authStub } = mockAuth()
  const sut = new UserService(mockUserRepository, authStub)

  return { sut, authStub }
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

  test('call IUserRepository.getUserByEmailWithoutPassword with correct value', async ({
    expect,
  }) => {
    const { sut } = makeSut()
    const getUserByEmailWithoutPasswordSpy = Sinon.spy(
      mockUserRepository,
      'getUserByEmailWithoutPassword'
    )
    await sut.getFullInfoByUserLogged()

    expect(getUserByEmailWithoutPasswordSpy.calledWith('valid_email@mail.com')).toBeTruthy()
  })
})
