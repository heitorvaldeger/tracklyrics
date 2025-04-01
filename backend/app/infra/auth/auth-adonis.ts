import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { inject } from '@adonisjs/core'

import { Auth } from '#infra/auth/protocols/auth'

@inject()
export class AuthAdonis implements Auth {
  constructor(private readonly auth: Authenticator<Authenticators>) {}

  getUserId() {
    return this.auth.user?.id
  }

  getUserEmail() {
    return this.auth.user?.email
  }

  getUserUuid() {
    return this.auth.user?.uuid
  }
}
