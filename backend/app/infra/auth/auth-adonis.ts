import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { inject } from '@adonisjs/core'

import { UserEmailStatus } from '#enums/user-email-status'
import EmailPendingValidationException from '#exceptions/email-pending-validation-exception'
import { Auth } from '#infra/auth/interfaces/auth'
import { User } from '#models/user'

@inject()
export class AuthAdonis implements Auth {
  constructor(private readonly auth: Authenticator<Authenticators>) {}

  getUser<T>(): T | null {
    return this.auth.user as T | null
  }

  getUserId() {
    return this.auth.user?.id
  }

  getUserEmail() {
    return this.auth.user?.email
  }

  getUserUuid() {
    return this.auth.user?.uuid
  }

  async login(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)

    if (user.emailStatus === UserEmailStatus.UNVERIFIED) {
      throw new EmailPendingValidationException()
    }

    await this.auth.use(this.auth.defaultGuard).login(user)
  }

  async logout() {
    if (await this.auth.check()) {
      await this.auth.use(this.auth.defaultGuard).logout()
    }
  }
}
