import { test } from '@japa/runner'
import Sinon, { spy, stub } from 'sinon'

import UpdatePasswordController from '#controllers/user/UpdatePasswordController'
import ValidationException from '#exceptions/ValidationException'
import { mockUserService } from '#tests/__mocks__/stubs/mock-user-stub'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = () => {
  const sut = new UpdatePasswordController(mockUserService, validatorSchema)

  return { sut }
}

test.group('User/UpdatePasswordController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 204 if updatePassword was executed with success', async ({ expect }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({
      password: 'any_password',
    })

    await sut.handle(httpContext)

    expect(httpContext.response.getStatus()).toBe(204)
  })

  test('return an exception if update password throws', async ({ expect }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({
      password: 'pass',
    })

    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))

    const promise = sut.handle(httpContext)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('call IUserService.updatePassword with correct value', async ({ expect }) => {
    const { sut } = makeSut()
    const updatePasswordSpy = spy(mockUserService, 'updatePassword')
    const httpContext = makeHttpRequest({
      password: 'any_password',
    })

    await sut.handle(httpContext)

    expect(updatePasswordSpy.calledWith('any_password')).toBeTruthy()
  })

  test('return 500 if updatePassword throws exception', async ({ expect }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({
      password: 'any_password',
    })
    stub(mockUserService, 'updatePassword').rejects(new Error())

    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new Error())
  })
})
