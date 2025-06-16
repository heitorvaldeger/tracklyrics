import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import AuthController from '#controllers/auth-controller'
import InvalidCredentialsException from '#exceptions/invalid-credentials-exception'
import { mockAuthService } from '#tests/__mocks__/stubs/mock-auth-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = () => {
  const httpContext = makeHttpRequest({
    email: faker.internet.email(),
    password: faker.internet.password(),
  })

  const sut = new AuthController(mockAuthService)

  return { sut, httpContext }
}
test.group('AuthController.login', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('it must return 400 if required fields is not provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request, 'body').returns({})
    await sut.login(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'email',
        message: 'The email field must be defined',
      },
      {
        field: 'password',
        message: 'The password field must be defined',
      },
    ])
  })

  test('it must return 400 if email provided is invalid', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request.body(), 'email').value('invalid_mail')
    await sut.login(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'email',
        message: 'The email field must be a valid email address',
      },
    ])
  })

  test('it must return 400 if password provided is less than length valid', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request, 'body').returns({
      email: 'valid_mail@mail.com',
      password: 'any',
    })

    await sut.login(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'password',
        message: 'The password field must have at least 6 characters',
      },
    ])
  })

  test('it must return 200 if create accessToken on success', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()
    await sut.login(ctx)

    expect(ctx.response.getStatus()).toBe(204)
  })

  test('it must return 401 if invalid credentials is provided', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'login').rejects(new InvalidCredentialsException())
    const httpResponse = sut.login(httpContext)

    expect(httpResponse).rejects.toEqual(new InvalidCredentialsException())
  })

  test('it must return 500 if create accessToken return throws', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'login').throws(new Error())
    const httpResponse = sut.login(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
