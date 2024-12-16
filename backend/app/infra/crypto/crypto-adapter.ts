import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'
import * as OTPAuth from 'otpauth'

import { HashAdapter } from '#infra/crypto/protocols/hash-adapter'
import { OTPAdapter } from '#infra/crypto/protocols/otp-adapter'

@inject()
export class CryptoAdapter implements OTPAdapter, HashAdapter {
  private readonly totp
  constructor() {
    this.totp = new OTPAuth.TOTP({
      issuer: 'ACME',
      algorithm: 'SHA1',
      digits: 6,
      period: 600,
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
