import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import AuthController from '#controllers/auth-controller'
import { UserEmailStatus } from '#enums/user-email-status'
import UserOrEmailAlreadyUsingException from '#exceptions/user-or-email-already-using-exception'
import { mockAuthService } from '#tests/__mocks__/stubs/mock-auth-stub'
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
  const sut = new AuthController(mockAuthService)

  return { sut, httpContext }
}
test.group('AuthController.register', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('it must return 400 if required fields is not provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request, 'body').returns({})
    await sut.register(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'email',
        message: 'The email field must be defined',
        rule: 'required',
      },
      {
        field: 'password',
        message: 'The password field must be defined',
        rule: 'required',
      },
      {
        field: 'username',
        message: 'The username field must be defined',
        rule: 'required',
      },
      {
        field: 'firstName',
        message: 'The firstName field must be defined',
        rule: 'required',
      },
      {
        field: 'lastName',
        message: 'The lastName field must be defined',
        rule: 'required',
      },
    ])
  })

  test('it must return 400 if email provided is invalid', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request.body(), 'email').value('invalid_mail')
    await sut.register(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'email',
        message: 'The email field must be a valid email address',
        rule: 'email',
      },
    ])
  })

  test('it must return 400 if fields provided is less than length valid', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request, 'body').returns({
      email: 'valid_mail@mail.com',
      password: 'any',
      username: 'any',
      firstName: '',
      lastName: '',
    })
    await sut.register(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'password',
        message: 'The password field must have at least 6 characters',
        meta: {
          min: 6,
        },
        rule: 'minLength',
      },
      {
        field: 'username',
        message: 'The username field must have at least 4 characters',
        meta: {
          min: 4,
        },
        rule: 'minLength',
      },
      {
        field: 'firstName',
        message: 'The firstName field must have at least 1 characters',
        meta: {
          min: 1,
        },
        rule: 'minLength',
      },
      {
        field: 'lastName',
        message: 'The lastName field must have at least 1 characters',
        meta: {
          min: 1,
        },
        rule: 'minLength',
      },
    ])
  })

  test('it must return 422 if email provided already in use', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'register').rejects(new UserOrEmailAlreadyUsingException())
    const httpResponse = sut.register(httpContext)

    expect(httpResponse).rejects.toEqual(new UserOrEmailAlreadyUsingException())
  })

  test('it must return 200 if create user return success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.register(httpContext)

    expect(httpResponse).toEqual({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.UNVERIFIED,
    })
  })

  test('it must return 500 if create user return throws', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockAuthService, 'register').throws(new Error())
    const httpResponse = sut.register(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
