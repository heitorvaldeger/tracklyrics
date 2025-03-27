import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import AuthController from '#controllers/auth-controller'
import { UserEmailStatus } from '#enums/user-email-status'
import UserOrEmailAlreadyUsingException from '#exceptions/user-or-email-already-using-exception'
import { mockAuthRegisterData, mockAuthService } from '#tests/__mocks__/stubs/mock-auth-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = () => {
  const httpContext = makeHttpRequest(mockAuthRegisterData())
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
  })

  test('it must return 400 if email provided is invalid', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()

    stub(ctx.request.body(), 'email').value('invalid_mail')
    await sut.register(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'email',
        message: 'The email field must be a valid email address',
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
