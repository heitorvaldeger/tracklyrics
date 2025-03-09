import { inject } from '@adonisjs/core'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { UserRepository } from '#infra/db/repository/_protocols/user-repository'
import { UserWithoutPasswordModel } from '#models/user-model/user-without-password-model'
import { UserProtocolService } from '#services/_protocols/user-protocol-service'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'

@inject()
export class UserService implements UserProtocolService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auth: AuthStrategy
  ) {}

  async getFullInfoByUserLogged(): Promise<MethodResponse<UserWithoutPasswordModel>> {
    const userEmail = this.auth.getUserEmail()
    if (!userEmail) {
      return createFailureResponse(APPLICATION_MESSAGES.UNAUTHORIZED)
    }

    const user = await this.userRepository.getUserByEmailWithoutPassword(userEmail)
    if (!user) {
      return createFailureResponse(APPLICATION_MESSAGES.USER_NOTFOUND)
    }

    return createSuccessResponse(user)
  }
}
