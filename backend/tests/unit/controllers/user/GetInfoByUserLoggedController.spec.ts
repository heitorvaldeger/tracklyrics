import { test } from '@japa/runner'
import { stub } from 'sinon'

import GetInfoByUserLoggedController from '#controllers/user/GetInfoByUserLoggedController'
import UnauthorizedException from '#exceptions/unauthorized-exception'
import UserNotFoundException from '#exceptions/user-not-found-exception'
import { mockUserService, mockUserWithoutPasswordData } from '#tests/__mocks__/stubs/mock-user-stub'

const makeSut = () => {
  const sut = new GetInfoByUserLoggedController(mockUserService)

  return { sut }
}

test.group('User/GetInfoByUserLoggedController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return success with user information on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle()

    expect(httpResponse).toEqual(mockUserWithoutPasswordData)
  })

  test('return an unauthorized exception if email provided is invalid', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockUserService, 'getFullInfoByUserLogged').rejects(new UnauthorizedException())
    const httpResponse = sut.handle()

    expect(httpResponse).rejects.toEqual(new UnauthorizedException())
  })

  test('return an exception not found if user was not found', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockUserService, 'getFullInfoByUserLogged').rejects(new UserNotFoundException())
    const httpResponse = sut.handle()

    expect(httpResponse).rejects.toEqual(new UserNotFoundException())
  })

  test('return an exception if getFullInfoByUserLogged throws', async ({ expect }) => {
    const { sut } = makeSut()

    stub(mockUserService, 'getFullInfoByUserLogged').throws(new Error())

    const httpResponse = sut.handle()

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
