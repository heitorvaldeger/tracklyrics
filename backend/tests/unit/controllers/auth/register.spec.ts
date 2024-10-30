import { test } from '@japa/runner'
import { stub } from 'sinon'
import { badRequest, ok, unprocessable } from '#helpers/http'
import AuthController from '#controllers/AuthController'
import { makeHttpRequestBody } from '#tests/factories/makeHttpRequestBody'
import User from '#models/user'
import { randomUUID } from 'node:crypto'

const makeFakeRequest = () => ({
  username: 'any_username',
  email: 'any_mail@mail.com',
  password: 'any_password',
  firstName: 'any_firstName',
  lastName: 'any_lastName',
})
const makeSut = () => {
  const httpContext = makeHttpRequestBody(makeFakeRequest())

  const sut = new AuthController()

  return { sut, httpContext }
}
test.group('AuthController.register', (group) => {
  group.setup(async () => {
    await User.query().whereNotNull('id').delete()
  })

  test('should returns 400 if required fields is not provided', async ({ expect }) => {
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

  test('should returns 400 if email provided is invalid', async ({ expect }) => {
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

  test('should returns 400 if fields provided is less than length valid', async ({ expect }) => {
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

  test('should returns 400 if email provided already in use', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    User.create({
      ...makeFakeRequest(),
      uuid: randomUUID(),
    })
    const httpResponse = await sut.register(httpContext)

    expect(httpResponse).toEqual(
      unprocessable({
        message: 'Email or username already in use. Please choose another.',
      })
    )
  })
})
