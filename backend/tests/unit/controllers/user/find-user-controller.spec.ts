import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import UserController from '#controllers/UserController'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import User from '#models/user'
import { randomUUID } from 'node:crypto'

const makeSut = () => {
  const httpContext = new HttpContextFactory().create()
  const sut = new UserController()

  return { sut, httpContext }
}
test.group('UserController.find', (group) => {
  group.each.setup(async () => {
    await User.query().whereNotNull('id').delete()
  })

  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 200 if return a user on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const uuid = randomUUID()
    const user = await User.create({
      username: 'any_username',
      email: 'any_mail@mail.com',
      password: 'any_password',
      firstName: 'any_firstName',
      lastName: 'any_lastName',
      uuid,
    })
    stub(httpContext.request, 'params').returns({
      uuid,
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(ok(user.serialize()))
  })

  test('should returns 404 if return a user not found', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: '00000000-0000-0000-0000-000000000000',
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(notFound())
  })

  test('should returns 400 if pass invalid uuid on find', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('should returns 500 if find user throws', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: randomUUID(),
    })
    stub(User, 'query').throws(new Error())

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
