import { inject } from '@adonisjs/core'

import UserNotFoundException from '#exceptions/user-not-found-exception'
import { Auth } from '#infra/auth/protocols/auth'
import { UserRepository } from '#infra/db/repository/_protocols/user-repository'
import { UserProtocolService } from '#services/_protocols/user-protocol-service'

@inject()
export class UserService implements UserProtocolService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auth: Auth
  ) {}

  async getFullInfoByUserLogged() {
    const userEmail = this.auth.getUserEmail()!

    const user = await this.userRepository.getUserByEmailWithoutPassword(userEmail)
    if (!user) {
      throw new UserNotFoundException()
    }

    return user
  }
}
