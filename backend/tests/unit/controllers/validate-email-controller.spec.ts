import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import AuthController from '#controllers/auth-controller'
import { UserEmailStatus } from '#enums/user-email-status'
import CodeOtpInvalidException from '#exceptions/code-otp-invalid-exception'
import EmailHasBeenVerifiedException from '#exceptions/email-has-been-verified-exception'
import EmailInvalidException from '#exceptions/email-invalid-exception'
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
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request, 'body').returns({})
    await sut.validateEmail(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'email',
        message: 'The email field must be defined',
      },
      {
        field: 'codeOTP',
        message: 'The codeOTP field must be defined',
      },
    ])
  })

  test('return 400 if email provided is invalid', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request.body(), 'email').value('invalid_mail')
    await sut.validateEmail(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'email',
        message: 'The email field must be a valid email address',
      },
    ])
  })

  test('return 400 if codeOTP is not equal than length valid', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request.body(), 'codeOTP').value('123')
    await sut.validateEmail(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'codeOTP',
        message: 'The codeOTP field must be 6 characters long',
      },
    ])
  })

  test('return 422 if user already exist and email status is verified', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').rejects(new EmailHasBeenVerifiedException())
    const httpResponse = sut.validateEmail(httpContext)

    expect(httpResponse).rejects.toEqual(new EmailHasBeenVerifiedException())
  })

  test('return 422 if user not exist', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').rejects(new EmailInvalidException())
    const httpResponse = sut.validateEmail(httpContext)

    expect(httpResponse).rejects.toEqual(new EmailInvalidException())
  })

  test('return 422 if code OTP is invalid', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').rejects(new CodeOtpInvalidException())
    const httpResponse = sut.validateEmail(httpContext)

    expect(httpResponse).rejects.toEqual(new CodeOtpInvalidException())
  })

  test('return 200 if validate email with success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.validateEmail(httpContext)

    expect(httpResponse).toEqual({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.VERIFIED,
    })
  })

  test('return 500 if validate email return throws', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'validateEmail').throws(new Error())
    const httpResponse = sut.validateEmail(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
