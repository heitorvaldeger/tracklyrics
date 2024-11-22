import { test } from '@japa/runner'
import { AuthService } from '#services/auth-service'
import { Authenticator } from '@adonisjs/auth'
import sinon, { stub } from 'sinon'
import { IUserRepository } from '#repository/interfaces/IUserRepository'
import UserLucid from '#models/user/user-lucid'
import { UserCreateParams } from '#params/user/user-create-params'

export const mockVideoRepositoryStub = () => {
  class UserRepositoryStub implements IUserRepository {
    getUserByEmailOrUsername(payload: any): Promise<UserLucid | null> {
      throw new Error('Method not implemented.')
    }
    create(user: UserCreateParams): Promise<UserLucid> {
      throw new Error('Method not implemented.')
    }
    createAccessToken(payload: any): Promise<any> {
      throw new Error('Method not implemented.')
    }
  }

  return new UserRepositoryStub()
}

const makeSut = () => {
  const sut = new AuthService(mockVideoRepositoryStub())

  return { sut }
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
})
