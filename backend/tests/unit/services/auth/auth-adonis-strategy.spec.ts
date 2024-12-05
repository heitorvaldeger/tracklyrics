import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import { AuthAdonisStrategy } from '#services/auth/strategy/auth-adonis-strategy'

const authMock = {
  user: { id: 1 },
} as Authenticator<Authenticators>

test.group('Auth Adonis Strategy', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns a user id on getUserId', async ({ expect }) => {
    const sut = new AuthAdonisStrategy(authMock)
    const userId = sut.getUserId()

    expect(userId).toBe(1)
  })

  test('should returns -1 on getUserId if auth property is null', async ({ expect }) => {
    stub(authMock, 'user').value({})
    const sut = new AuthAdonisStrategy(authMock)
    const userId = sut.getUserId()

    expect(userId).toBe(-1)
  })
})
