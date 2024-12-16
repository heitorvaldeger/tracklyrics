import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import AuthController from '#controllers/auth-controller'
import { UserEmailStatus } from '#enums/user-email-status'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { badRequest, ok, serverError, unprocessable } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { mockRegisterRequest } from '#tests/factories/mocks/mock-register-request'
import { mockAuthServiceStub } from '#tests/factories/stubs/services/mock-auth-service-stub'

const mockRequest = {
  email: faker.internet.email(),
  codeOTP: faker.string.numeric({
    length: 6,
  }),
}
const makeSut = () => {
  const httpContext = makeHttpRequest(mockRequest)
  const authServiceStub = mockAuthServiceStub()
  const sut = new AuthController(authServiceStub, authServiceStub)

  return { sut, httpContext, authServiceStub }
}
test.group('AuthController.validateEmail', () => {
  test('it must return 400 if required fields is not provided', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    stub(httpContext.request, 'body').returns({})
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'email',
          message: 'The email field must be defined',
        },
        {
          field: 'codeOTP',
          message: 'The codeOTP field must be defined',
        },
      ])
    )
  })

  test('it must return 400 if email provided is invalid', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    stub(httpContext.request.body(), 'email').value('invalid_mail')
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'email',
          message: 'The email field must be a valid email address',
        },
      ])
    )
  })

  test('it must return 400 if codeOTP is not equal than length valid', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    stub(httpContext.request.body(), 'codeOTP').value('123')
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'codeOTP',
          message: 'The codeOTP field must be 6 characters long',
        },
      ])
    )
  })

  test('it must return 422 if user already exist and email status is verified', async ({
    expect,
  }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').returns(
      Promise.resolve(createFailureResponse(APPLICATION_MESSAGES.EMAIL_HAS_BEEN_VERIFIED))
    )
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(unprocessable(APPLICATION_MESSAGES.EMAIL_HAS_BEEN_VERIFIED))
  })

  test('it must return 422 if user not exist', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').returns(
      Promise.resolve(createFailureResponse(APPLICATION_MESSAGES.EMAIL_INVALID))
    )
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(unprocessable(APPLICATION_MESSAGES.EMAIL_INVALID))
  })

  test('it must return 422 if code OTP is invalid', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').returns(
      Promise.resolve(createFailureResponse(APPLICATION_MESSAGES.CODE_OTP_INVALID))
    )
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(unprocessable(APPLICATION_MESSAGES.CODE_OTP_INVALID))
  })

  test('it must return 200 if validate email with success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(
      ok({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.VERIFIED,
      })
    )
  })

  test('it must return 500 if validate email return throws', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').throws(new Error())
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
