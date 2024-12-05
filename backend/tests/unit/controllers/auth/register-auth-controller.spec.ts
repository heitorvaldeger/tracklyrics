import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import AuthController from '#controllers/auth-controller'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { badRequest, ok, serverError, unprocessable } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
import { mockUserRegisterRequest } from '#tests/factories/fakes/mock-user-register-request'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { mockAuthServiceStub } from '#tests/factories/stubs/services/mock-auth-service-stub'

const makeSut = () => {
  const httpContext = makeHttpRequest(mockUserRegisterRequest())
  const authServiceStub = mockAuthServiceStub()
  const sut = new AuthController(authServiceStub, authServiceStub)

  return { sut, httpContext, authServiceStub }
}
test.group('AuthController.register', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should return 400 if required fields is not provided', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    stub(httpContext.request, 'body').returns({})
    const httpResponse = await sut.register(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'email',
          message: 'The email field must be defined',
        },
        {
          field: 'password',
          message: 'The password field must be defined',
        },
        {
          field: 'username',
          message: 'The username field must be defined',
        },
        {
          field: 'firstName',
          message: 'The firstName field must be defined',
        },
        {
          field: 'lastName',
          message: 'The lastName field must be defined',
        },
      ])
    )
  })

  test('should return 400 if email provided is invalid', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    stub(httpContext.request.body(), 'email').value('invalid_mail')
    const httpResponse = await sut.register(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'email',
          message: 'The email field must be a valid email address',
        },
      ])
    )
  })

  test('should return 400 if fields provided is less than length valid', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    stub(httpContext.request, 'body').returns({
      email: 'valid_mail@mail.com',
      password: 'any',
      username: 'any',
      firstName: '',
      lastName: '',
    })
    const httpResponse = await sut.register(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'password',
          message: 'The password field must have at least 6 characters',
        },
        {
          field: 'username',
          message: 'The username field must have at least 4 characters',
        },
        {
          field: 'firstName',
          message: 'The firstName field must have at least 1 characters',
        },
        {
          field: 'lastName',
          message: 'The lastName field must have at least 1 characters',
        },
      ])
    )
  })

  test('should return 422 if email provided already in use', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'register').returns(
      Promise.resolve(createFailureResponse(APPLICATION_ERRORS.EMAIL_OR_USERNAME_ALREADY_USING))
    )
    const httpResponse = await sut.register(httpContext)

    expect(httpResponse).toEqual(unprocessable(APPLICATION_ERRORS.EMAIL_OR_USERNAME_ALREADY_USING))
  })

  test('should return 200 if create user return success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.register(httpContext)

    expect(httpResponse).toEqual(
      ok({
        type: 'any_type',
        token: 'any_token',
      })
    )
  })

  test('should return 500 if create user return throws', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'register').throws(new Error())
    const httpResponse = await sut.register(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
