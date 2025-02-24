import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { inject } from '@adonisjs/core'

import { AuthStrategy } from '#services/auth/strategy/auth-strategy'

@inject()
export class AuthAdonisStrategy implements AuthStrategy {
  constructor(private readonly auth: Authenticator<Authenticators>) {}

  getUserId() {
    return this.auth.user?.id ?? -1
  }

  getUserEmail() {
    return this.auth.user?.email
  }

  getUserUuid() {
    return this.auth.user?.uuid
  }
}
