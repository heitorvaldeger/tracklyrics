import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import AuthController from '#controllers/auth-controller'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { badRequest, ok, serverError, unauthorized } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
import { mockAuthServiceStub } from '#tests/__mocks__/stubs/mock-auth-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = () => {
  const httpContext = makeHttpRequest({
    email: faker.internet.email(),
    password: faker.internet.password(),
  })
  const authServiceStub = mockAuthServiceStub()
  const sut = new AuthController(authServiceStub, authServiceStub)

  return { sut, httpContext, authServiceStub }
}
test.group('AuthController.login', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('it must return 400 if required fields is not provided', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    stub(httpContext.request, 'body').returns({})
    const httpResponse = await sut.login(httpContext)

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
      ])
    )
  })

  test('it must return 400 if email provided is invalid', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    stub(httpContext.request.body(), 'email').value('invalid_mail')
    const httpResponse = await sut.login(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'email',
          message: 'The email field must be a valid email address',
        },
      ])
    )
  })

  test('it must return 400 if fields provided is less than length valid', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    stub(httpContext.request, 'body').returns({
      email: 'valid_mail@mail.com',
      password: 'any',
    })
    const httpResponse = await sut.login(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'password',
          message: 'The password field must have at least 6 characters',
        },
      ])
    )
  })

  test('it must return 200 if create accessToken on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.login(httpContext)

    expect(httpResponse).toEqual(
      ok({
        type: 'any_type',
        token: 'any_token',
      })
    )
  })

  test('it must return 401 if invalid credentials is provided', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'login').resolves(
      createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID)
    )
    const httpResponse = await sut.login(httpContext)

    expect(httpResponse).toEqual(unauthorized(APPLICATION_MESSAGES.CREDENTIALS_INVALID))
  })

  test('it must return 500 if create accessToken return throws', async ({ expect }) => {
    const { sut, httpContext, authServiceStub } = makeSut()
    stub(authServiceStub, 'login').throws(new Error())
    const httpResponse = await sut.login(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
