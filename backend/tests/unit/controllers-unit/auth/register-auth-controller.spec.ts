import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'
import { badRequest, ok, serverError, unprocessable } from '#helpers/http'
import AuthController from '#controllers/auth-controller'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { Secret } from '@adonisjs/core/helpers'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { IAuthService } from '#services/interfaces/IAuthService'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import UserLucid from '#models/user-model/user-lucid'
import { UserRegisterRequest } from '#params/user-params/user-register-request'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'

export const mockAuthServiceStub = () => {
  class AuthServiceStub implements IAuthService {
    private auth: Authenticator<Authenticators> | null = null
    public setAuth(auth: Authenticator<Authenticators>) {
      this.auth = auth
    }

    getUserId(): number {
      return 0
    }

    async register(payload: UserRegisterRequest): Promise<IMethodResponse<UserAccessTokenModel>> {
      return createSuccessResponse({
        type: 'any_type',
        token: 'any_token',
      })
    }
  }

  return new AuthServiceStub()
}

const makeFakeRequest = () => ({
  username: 'any_username',
  email: 'any_mail@mail.com',
  password: 'any_password',
  firstName: 'any_firstName',
  lastName: 'any_lastName',
})
const makeSut = () => {
  const httpContext = makeHttpRequest(makeFakeRequest())
  const authServiceStub = mockAuthServiceStub()
  const sut = new AuthController(authServiceStub)

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

    expect(httpResponse).toEqual(
      unprocessable(APPLICATION_ERRORS.EMAIL_OR_USERNAME_ALREADY_USING.message)
    )
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
