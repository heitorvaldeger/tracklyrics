import { inject } from '@adonisjs/core'

import UserNotFoundException from '#exceptions/user-not-found-exception'
import { Auth } from '#infra/auth/interfaces/auth'
import { IUserRepository } from '#infra/db/repository/interfaces/user-repository'
import { IUserService } from '#services/interfaces/user-service'

@inject()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
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
