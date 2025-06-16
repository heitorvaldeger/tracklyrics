import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import ValidateEmailController from '#controllers/auth/ValidateEmailController'
import { UserEmailStatus } from '#enums/user-email-status'
import CodeOtpInvalidException from '#exceptions/code-otp-invalid-exception'
import EmailHasBeenVerifiedException from '#exceptions/email-has-been-verified-exception'
import EmailInvalidException from '#exceptions/email-invalid-exception'
import ValidationException from '#exceptions/ValidationException'
import { mockAuthService } from '#tests/__mocks__/stubs/mock-auth-stub'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const mockRequest = {
  email: faker.internet.email(),
  codeOTP: faker.string.numeric({
    length: 6,
  }),
}
const makeSut = () => {
  const httpContext = makeHttpRequest(mockRequest)
  const sut = new ValidateEmailController(mockAuthService, validatorSchema)

  return { sut, httpContext }
}
test.group('Auth/ValidateEmailController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return an exception if validation throws', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))
    stub(ctx.request, 'body').returns({})
    const promise = sut.handle(ctx)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('return 422 if user already exist and email status is verified', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'validateEmail').rejects(new EmailHasBeenVerifiedException())
    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new EmailHasBeenVerifiedException())
  })

  test('return 422 if user not exist', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'validateEmail').rejects(new EmailInvalidException())
    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new EmailInvalidException())
  })

  test('return 422 if code OTP is invalid', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'validateEmail').rejects(new CodeOtpInvalidException())
    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new CodeOtpInvalidException())
  })

  test('return 200 if validate email with success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.handle(httpContext)

    expect(httpResponse).toEqual({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.VERIFIED,
    })
  })

  test('return 500 if validate email return throws', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'validateEmail').throws(new Error())
    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new Error())
  })
})
