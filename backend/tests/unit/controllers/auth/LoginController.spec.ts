import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import LoginController from '#controllers/auth/LoginController'
import InvalidCredentialsException from '#exceptions/invalid-credentials-exception'
import ValidationException from '#exceptions/ValidationException'
import { mockAuthService } from '#tests/__mocks__/stubs/mock-auth-stub'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = () => {
  const httpContext = makeHttpRequest({
    email: faker.internet.email(),
    password: faker.internet.password(),
  })

  const sut = new LoginController(mockAuthService, validatorSchema)

  return { sut, httpContext }
}
test.group('AuthController.login', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('it must return 400 if Validation returns failed', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))
    const promise = sut.handle(ctx)

    await expect(promise).rejects.toEqual(new ValidationException([]))
  })

  test('it must return 200 if create accessToken on success', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()
    await sut.handle(ctx)

    expect(ctx.response.getStatus()).toBe(204)
  })

  test('it must return 401 if invalid credentials is provided', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'login').rejects(new InvalidCredentialsException())
    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new InvalidCredentialsException())
  })

  test('it must return 500 if create accessToken return throws', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'login').throws(new Error())
    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new Error())
  })
})
