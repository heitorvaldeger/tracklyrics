import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { TOTP } from 'otpauth'
import { stub } from 'sinon'

import { OTPAuthAdapter } from '#infra/crypto/otpauth-adapter'

const makeSut = () => {
  const sut = new OTPAuthAdapter()
  return { sut }
}

test.group('OTPAuth Adapter', () => {
  test('should return a token with success', async ({ expect }) => {
    const { sut } = makeSut()

    const token = await sut.create('any_id')
    expect(token).toBeTruthy()
    expect(token.length).toBe(6)
    expect(token).toMatch(/^[0-9]*$/)
  })

  test('should validate a token with success', async ({ expect }) => {
    const { sut } = makeSut()

    stub(TOTP, 'validate').returns(1)

    const isValid = await sut.validate('any_token')
    expect(isValid).toBeTruthy()
  })

  test('should validate a token with fail', async ({ expect }) => {
    const { sut } = makeSut()

    stub(TOTP, 'validate').returns(-1)

    const isValid = await sut.validate('invalid_token')
    expect(isValid).toBeFalsy()
  })
})
