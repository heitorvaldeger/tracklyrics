import { test } from '@japa/runner'
import { spy, stub } from 'sinon'

import ValidateUpdatePasswordController from '#controllers/user/ValidateUpdatePasswordController'
import ValidationException from '#exceptions/ValidationException'
import { mockUserService } from '#tests/__mocks__/stubs/mock-user-stub'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = () => {
  const sut = new ValidateUpdatePasswordController(mockUserService, validatorSchema)

  return { sut }
}

test.group('User/ValidateUpdatePasswordController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 204 if validateUpdatePassword was executed with success', async ({ expect }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({
      codeOTP: '123456',
    })

    await sut.handle(httpContext)

    expect(httpContext.response.getStatus()).toBe(204)
  })

  test('return an exception if validate update password throws', async ({ expect }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({
      codeOTP: '12',
    })

    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))

    const promise = sut.handle(httpContext)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('call IUserService.validateUpdatePassword with correct value', async ({ expect }) => {
    const { sut } = makeSut()
    const updatePasswordSpy = spy(mockUserService, 'validateUpdatePassword')
    const httpContext = makeHttpRequest({
      codeOTP: '123456',
    })
    await sut.handle(httpContext)

    expect(updatePasswordSpy.calledWith('123456')).toBeTruthy()
  })

  test('return an exception if IUserService.validateUpdatePassword throws', async ({ expect }) => {
    const { sut } = makeSut()
    const httpContext = makeHttpRequest({
      codeOTP: '123456',
    })
    stub(mockUserService, 'validateUpdatePassword').rejects(new Error())

    const httpResponse = sut.handle(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
