import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import RegisterController from '#controllers/auth/RegisterController'
import { UserEmailStatus } from '#enums/user-email-status'
import UserOrEmailAlreadyUsingException from '#exceptions/user-or-email-already-using-exception'
import ValidationException from '#exceptions/ValidationException'
import { mockAuthService } from '#tests/__mocks__/stubs/mock-auth-stub'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = () => {
  const password = faker.internet.password()
  const httpContext = makeHttpRequest({
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: password,
    password_confirmation: password,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  })
  const sut = new RegisterController(mockAuthService, validatorSchema)

  return { sut, httpContext }
}
test.group('Auth/RegisterController', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('it must return exception if Validation throws', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))
    stub(ctx.request, 'body').returns({})
    const promise = sut.handle(ctx)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('it must return 422 if email provided already in use', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'register').rejects(new UserOrEmailAlreadyUsingException())
    const httpResponse = sut.handle(httpContext)

    expect(httpResponse).rejects.toEqual(new UserOrEmailAlreadyUsingException())
  })

  test('it must return 200 if create user return success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.handle(httpContext)

    expect(httpResponse).toEqual({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.UNVERIFIED,
    })
  })

  test('it must return 500 if create user return throws', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'register').throws(new Error())
    const httpResponse = sut.handle(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
