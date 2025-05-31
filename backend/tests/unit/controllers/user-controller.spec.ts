import { test } from '@japa/runner'
import { spy, stub } from 'sinon'

import UserController from '#controllers/user-controller'
import UnauthorizedException from '#exceptions/unauthorized-exception'
import UserNotFoundException from '#exceptions/user-not-found-exception'
import { mockUserService, mockUserWithoutPasswordData } from '#tests/__mocks__/stubs/mock-user-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

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

  test('return 204 if validateUpdatePassword was executed with success', async ({ expect }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({
      codeOTP: '123456',
    })

    await sut.validateUpdatePassword(httpContext)

    expect(httpContext.response.getStatus()).toBe(204)
  })

  test('return 400 if fields provided is not valid on validateUpdatePassword', async ({
    expect,
  }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({
      codeOTP: '12',
    })

    await sut.validateUpdatePassword(httpContext)

    expect(httpContext.response.getBody()).toEqual([
      {
        field: 'codeOTP',
        message: 'The codeOTP field must be 6 characters long',
      },
    ])
    expect(httpContext.response.getStatus()).toBe(400)
  })

  test('return 400 if fields is not provided on validateUpdatePassword', async ({ expect }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({})

    await sut.validateUpdatePassword(httpContext)

    expect(httpContext.response.getBody()).toEqual([
      {
        field: 'codeOTP',
        message: 'The codeOTP field must be defined',
      },
    ])
    expect(httpContext.response.getStatus()).toBe(400)
  })

  test('call IUserService.validateUpdatePassword with correct value', async ({ expect }) => {
    const { sut } = makeSut()
    const updatePasswordSpy = spy(mockUserService, 'validateUpdatePassword')
    const httpContext = makeHttpRequest({
      codeOTP: '123456',
    })
    await sut.validateUpdatePassword(httpContext)

    expect(updatePasswordSpy.calledWith('123456')).toBeTruthy()
  })

  test('return 500 if validateUpdatePassword throws exception', async ({ expect }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({
      codeOTP: '123456',
    })
    stub(mockUserService, 'validateUpdatePassword').rejects(new Error())

    const httpResponse = sut.validateUpdatePassword(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
