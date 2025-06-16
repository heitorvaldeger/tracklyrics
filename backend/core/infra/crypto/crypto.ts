import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'
import * as OTPAuth from 'otpauth'

import { IHashAdapter } from '#core/infra/crypto/interfaces/hash-adapter'
import { IOTPAdapter } from '#core/infra/crypto/interfaces/otp-adapter'

@inject()
export class Crypto implements IOTPAdapter, IHashAdapter {
  private readonly totp
  constructor() {
    this.totp = new OTPAuth.TOTP({
      issuer: 'ACME',
      algorithm: 'SHA1',
      digits: 6,
      period: 600, // 10 Minutes
      secret: new OTPAuth.Secret(),
    })
  }

  createOTP(id: string): Promise<string> {
    this.totp.label = id
    return Promise.resolve(this.totp.generate())
  }

  validateOTP(token: string): Promise<boolean> {
    return Promise.resolve(this.totp.validate({ token, window: 1 }) === 1)
  }

  async createHash(value: string): Promise<string> {
    return await hash.make(value)
  }

  async validateHash(hashedValue: string, plainValue: string): Promise<boolean> {
    return await hash.verify(hashedValue, plainValue)
  }
}
