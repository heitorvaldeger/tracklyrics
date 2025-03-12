import { test } from '@japa/runner'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import UserController from '#controllers/user-controller'
import { ok, serverError, unauthorized, unprocessable } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
import {
  mockUserServiceStub,
  mockUserWithoutPasswordData,
} from '#tests/__mocks__/stubs/mock-user-stub'

const makeSut = () => {
  const userServiceStub = mockUserServiceStub()
  const sut = new UserController(userServiceStub)

  return { sut, userServiceStub }
}

test.group('UserController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 200 with user information on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.getFullInfoByUserLogged()

    expect(httpResponse).toEqual(ok(mockUserWithoutPasswordData))
  })

  test('return 401 with user unauthenticated if email provided is invalid', async ({ expect }) => {
    const { sut, userServiceStub } = makeSut()

    stub(userServiceStub, 'getFullInfoByUserLogged').resolves(
      createFailureResponse(APPLICATION_MESSAGES.UNAUTHORIZED)
    )
    const httpResponse = await sut.getFullInfoByUserLogged()

    expect(httpResponse).toEqual(unauthorized(APPLICATION_MESSAGES.UNAUTHORIZED))
  })

  test('return 422 with user not found if user was not found', async ({ expect }) => {
    const { sut, userServiceStub } = makeSut()

    stub(userServiceStub, 'getFullInfoByUserLogged').resolves(
      createFailureResponse(APPLICATION_MESSAGES.USER_NOTFOUND)
    )
    const httpResponse = await sut.getFullInfoByUserLogged()

    expect(httpResponse).toEqual(unprocessable(APPLICATION_MESSAGES.USER_NOTFOUND))
  })

  test('return 500 if user getFullInfoByUserLogged throws', async ({ expect }) => {
    const { sut, userServiceStub } = makeSut()

    stub(userServiceStub, 'getFullInfoByUserLogged').throws(new Error())

    const httpResponse = await sut.getFullInfoByUserLogged()

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
