import { AuthStrategy } from '#services/auth/strategy/auth-strategy'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { inject } from '@adonisjs/core'

@inject()
export class AuthAdonisStrategy implements AuthStrategy {
  constructor(private readonly auth: Authenticator<Authenticators>) {}

  getUserId(): number {
    return this.auth.user?.id ?? -1
  }
}
