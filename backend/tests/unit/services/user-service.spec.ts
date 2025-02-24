import { test } from '@japa/runner'
import { stub } from 'sinon'

import { UserEmailStatus } from '#enums/user-email-status'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { UserService } from '#services/user-service'
import { mockAuthStrategyStub } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockUserRepositoryStub } from '#tests/__mocks__/stubs/mock-user-stub'

const makeSut = () => {
  const fakeUserRepositoryStub = mockUserRepositoryStub()
  const { authStrategyStub } = mockAuthStrategyStub()
  const sut = new UserService(fakeUserRepositoryStub, authStrategyStub)

  return { sut, authStrategyStub, fakeUserRepositoryStub }
}

test.group('UserService.getFullInfoByUserLogged', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return user unauthenticated if email provided is invalid', async ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()

    authStrategyStub.getUserEmail.returns(undefined)
    const httpResponse = await sut.getFullInfoByUserLogged()

    expect(httpResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.UNAUTHORIZED))
  })

  test('return user not found if user was not found', async ({ expect }) => {
    const { sut, fakeUserRepositoryStub } = makeSut()

    stub(fakeUserRepositoryStub, 'getUserByEmailWithoutPassword').resolves(null)
    const httpResponse = await sut.getFullInfoByUserLogged()

    expect(httpResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.USER_NOTFOUND))
  })

  test('return a full info by user logged with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.getFullInfoByUserLogged()

    expect(httpResponse).toEqual(
      createSuccessResponse({
        uuid: 'any_uuid',
        username: 'any_username',
        email: 'any_email',
        emailStatus: UserEmailStatus.VERIFIED,
        firstName: 'any_firstname',
        lastName: 'any_lastname',
      })
    )
  })

  test('return true if AuthStrategy.getUserEmail method was called', async ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()
    const getUserEmail = authStrategyStub.getUserEmail
    await sut.getFullInfoByUserLogged()

    expect(getUserEmail.called).toBeTruthy()
  })

  test('call UserRepository.getUserByEmailWithoutPassword with correct value', async ({
    expect,
  }) => {
    const { sut, fakeUserRepositoryStub } = makeSut()
    const getUserByEmailWithoutPasswordSpy = stub(
      fakeUserRepositoryStub,
      'getUserByEmailWithoutPassword'
    )
    await sut.getFullInfoByUserLogged()

    expect(getUserByEmailWithoutPasswordSpy.calledWith('valid_email@mail.com')).toBeTruthy()
  })
})
