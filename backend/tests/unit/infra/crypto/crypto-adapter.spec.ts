import { test } from '@japa/runner'
import { TOTP } from 'otpauth'
import { stub } from 'sinon'

import { CryptoAdapter } from '#infra/crypto/crypto-adapter'

const makeSut = () => {
  const sut = new CryptoAdapter()
  return { sut }
}

test.group('Crypto Adapter', () => {
  test('it must return a token with success', async ({ expect }) => {
    const { sut } = makeSut()

    const token = await sut.createOTP('any_id')
    expect(token).toBeTruthy()
    expect(token.length).toBe(6)
    expect(token).toMatch(/^[0-9]*$/)
  })

  test('it must validate a token with success', async ({ expect }) => {
    const { sut } = makeSut()

    stub(TOTP, 'validate').returns(1)

    const isValid = await sut.validateOTP('any_token')
    expect(isValid).toBeTruthy()
  })

  test('it must validate a token with fail', async ({ expect }) => {
    const { sut } = makeSut()

    stub(TOTP, 'validate').returns(-1)

    const isValid = await sut.validateOTP('invalid_token')
    expect(isValid).toBeFalsy()
  })
})
