import { inject } from '@adonisjs/core'
import * as OTPAuth from 'otpauth'

import { OTPAdapter } from '#infra/crypto/protocols/otp-adapter'

@inject()
export class OTPAuthAdapter implements OTPAdapter {
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

  create(id: string): Promise<string> {
    this.totp.label = id
    return Promise.resolve(this.totp.generate())
  }

  validate(token: string): Promise<boolean> {
    return Promise.resolve(this.totp.validate({ token, window: 1 }) === 1)
  }
}
