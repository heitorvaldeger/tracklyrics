import { test } from '@japa/runner'
import { AuthService } from '#services/auth-service'
import { Authenticator } from '@adonisjs/auth'
import sinon, { stub } from 'sinon'
import { IUserRepository } from '#repository/interfaces/IUserRepository'
import UserLucid from '#models/user-model/user-lucid'
import { UserCreateParams } from '#params/user-params/user-create-params'
import { UserModel } from '#models/user-model/user-model'
import { UserCreateAccessTokenParams } from '#params/user-params/user-create-access-token-params'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import { UserRegisterRequest } from '#params/user-params/user-register-request'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { mockUserRegisterRequest } from '#tests/factories/fakes/mock-user-register-request'

export const mockVideoRepositoryStub = () => {
  class UserRepositoryStub implements IUserRepository {
    getUserByEmailOrUsername(payload: any): Promise<UserModel | null> {
      return Promise.resolve(null)
    }
    create(user: UserCreateParams): Promise<UserModel> {
      return Promise.resolve({
        uuid: 'any_uuid',
        username: 'any_username',
        email: 'any_email',
      })
    }
    createAccessToken(payload: UserCreateAccessTokenParams): Promise<UserAccessTokenModel> {
      return Promise.resolve({
        type: 'any_type',
        token: 'any_token',
      })
    }
  }

  return new UserRepositoryStub()
}

const makeSut = () => {
  const userRepositoryStub = mockVideoRepositoryStub()
  const sut = new AuthService(userRepositoryStub)

  return { sut, userRepositoryStub }
}

test.group('AuthService', () => {
  test('should returns a user id valid on getUserId', async ({ expect }) => {
    const authenticator = sinon.createStubInstance(Authenticator)
    stub(authenticator, 'user').value({
      id: 1,
    })
    const { sut } = makeSut()

    sut.setAuth(authenticator)
    const userId = sut.getUserId()

    expect(userId).toBe(1)
  })

  test('should returns -1 on getUserId if auth property is null', async ({ expect }) => {
    const { sut } = makeSut()
    const userId = sut.getUserId()

    expect(userId).toBe(-1)
  })

  test('should return a token if user was register on success', async ({ expect }) => {
    const { sut } = makeSut()

    const userAccessToken = await sut.register(mockUserRegisterRequest())
    expect(userAccessToken).toEqual(
      createSuccessResponse({
        type: 'any_type',
        token: 'any_token',
      })
    )
  })

  test('should return a fail if user already using', async ({ expect }) => {
    const { sut, userRepositoryStub } = makeSut()
    const mockUser = mockUserRegisterRequest()
    stub(userRepositoryStub, 'getUserByEmailOrUsername').returns(
      Promise.resolve({
        email: mockUser.email,
        username: mockUser.username,
        uuid: 'any_uuid',
      })
    )

    const userAccessToken = await sut.register(mockUser)
    expect(userAccessToken).toEqual(
      createFailureResponse(APPLICATION_ERRORS.EMAIL_OR_USERNAME_ALREADY_USING)
    )
  })
})
