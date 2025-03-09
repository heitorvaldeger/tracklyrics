import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import AuthController from '#controllers/auth-controller'
import { UserEmailStatus } from '#enums/user-email-status'
import { badRequest, ok, serverError, unprocessable } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
import { mockAuthServiceStub } from '#tests/__mocks__/stubs/mock-auth-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const mockRequest = {
  email: faker.internet.email(),
  codeOTP: faker.string.numeric({
    length: 6,
  }),
}
const makeSut = () => {
  const httpContext = makeHttpRequest(mockRequest)
  const authServiceStub = mockAuthServiceStub()
  const sut = new AuthController(authServiceStub)

  return { sut, httpContext, authServiceStub }
}
test.group('AuthController.validateEmail', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 400 if required fields is not provided', async ({ expect }) => {
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

  test('return 400 if email provided is invalid', async ({ expect }) => {
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

  test('return 400 if codeOTP is not equal than length valid', async ({ expect }) => {
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

  test('return 422 if user already exist and email status is verified', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').returns(
      Promise.resolve(createFailureResponse(APPLICATION_MESSAGES.EMAIL_HAS_BEEN_VERIFIED))
    )
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(unprocessable(APPLICATION_MESSAGES.EMAIL_HAS_BEEN_VERIFIED))
  })

  test('return 422 if user not exist', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').returns(
      Promise.resolve(createFailureResponse(APPLICATION_MESSAGES.EMAIL_INVALID))
    )
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(unprocessable(APPLICATION_MESSAGES.EMAIL_INVALID))
  })

  test('return 422 if code OTP is invalid', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').returns(
      Promise.resolve(createFailureResponse(APPLICATION_MESSAGES.CODE_OTP_INVALID))
    )
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(unprocessable(APPLICATION_MESSAGES.CODE_OTP_INVALID))
  })

  test('return 200 if validate email with success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(
      ok({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.VERIFIED,
      })
    )
  })

  test('return 500 if validate email return throws', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').throws(new Error())
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
