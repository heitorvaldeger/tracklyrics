import { test } from '@japa/runner'
import { stub } from 'sinon'

import UserController from '#controllers/user-controller'
import UnauthorizedException from '#exceptions/unauthorized-exception'
import UserNotFoundException from '#exceptions/user-not-found-exception'
import { mockUserService, mockUserWithoutPasswordData } from '#tests/__mocks__/stubs/mock-user-stub'

const makeSut = () => {
  const sut = new UserController(mockUserService)

  return { sut }
}

test.group('UserController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 200 with user information on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.getFullInfoByUserLogged()

    expect(httpResponse).toEqual(mockUserWithoutPasswordData)
  })

  test('return 401 with user unauthenticated if email provided is invalid', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockUserService, 'getFullInfoByUserLogged').rejects(new UnauthorizedException())
    const httpResponse = sut.getFullInfoByUserLogged()

    expect(httpResponse).rejects.toEqual(new UnauthorizedException())
  })

  test('return 422 with user not found if user was not found', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockUserService, 'getFullInfoByUserLogged').rejects(new UserNotFoundException())
    const httpResponse = sut.getFullInfoByUserLogged()

    expect(httpResponse).rejects.toEqual(new UserNotFoundException())
  })

  test('return 500 if user getFullInfoByUserLogged throws', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockUserService, 'getFullInfoByUserLogged').throws(new Error())

    const httpResponse = sut.getFullInfoByUserLogged()

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
