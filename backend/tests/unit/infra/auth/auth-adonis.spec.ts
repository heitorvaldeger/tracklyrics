import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import { AuthAdonis } from '#core/infra/auth/auth-adonis'

const id = 1
const uuid = faker.string.uuid()
const email = 'valid_email@mail.com'

const makeSut = () => {
  const authMock = {
    user: { id, uuid, email },
  } as Authenticator<Authenticators>

  return {
    sut: new AuthAdonis(authMock),
    authMock,
  }
}
test.group('Auth Adonis Strategy', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('return an user id on getUserId', async ({ expect }) => {
    const { sut } = makeSut()
    const userId = sut.getUserId()

    expect(userId).toBe(id)
  })

  test('return null on getUserId if auth property is null', async ({ expect }) => {
    const { sut, authMock } = makeSut()
    stub(authMock, 'user').value({})
    const userId = sut.getUserId()

    expect(userId).toBeFalsy()
  })

  test('return an uuid on getUserUuid', async ({ expect }) => {
    const { sut } = makeSut()
    const userUuid = sut.getUserUuid()

    expect(userUuid).toBe(uuid)
  })

  test('return undefined on getUserUuid if there is not an user valid', async ({ expect }) => {
    const { sut, authMock } = makeSut()
    stub(authMock, 'user').value({})
    const userUuid = sut.getUserUuid()

    expect(userUuid).toBeFalsy()
  })

  test('return an email on getUserEmail', async ({ expect }) => {
    const { sut } = makeSut()
    const userEmail = sut.getUserEmail()

    expect(userEmail).toBe(email)
  })

  test('return undefined on getUserEmail if there is not an user valid', async ({ expect }) => {
    const { sut, authMock } = makeSut()
    stub(authMock, 'user').value({})
    const userEmail = sut.getUserEmail()

    expect(userEmail).toBeFalsy()
  })
})
