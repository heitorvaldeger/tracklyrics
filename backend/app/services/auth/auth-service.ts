import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'

import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { RegisterProtocolService } from '#services/protocols/register-protocol-service'

import { UserRepository } from '../../infra/db/protocols/user-repository.js'

@inject()
export class AuthService implements AuthProtocolService, RegisterProtocolService {
  constructor(
    private readonly userRepository: UserRepository,
    private authStrategy: AuthStrategy
  ) {}

  getUserId(): number {
    return this.authStrategy.getUserId()
  }

  async register(
    payload: RegisterProtocolService.Params
  ): Promise<IMethodResponse<UserAccessTokenModel>> {
    const { password, email, username, ...rest } = payload
    const passwordHashed = await hash.make(password)

    if (await this.userRepository.getUserByEmailOrUsername({ email, username })) {
      return createFailureResponse(APPLICATION_ERRORS.EMAIL_OR_USERNAME_ALREADY_USING)
    }

    const { uuid } = await this.userRepository.create({
      uuid: randomUUID(),
      email,
      username,
      password: passwordHashed,
      ...rest,
    })

    const userAccessToken = await this.userRepository.createAccessToken(uuid)
    return createSuccessResponse(userAccessToken)
  }

  async login({ email, password }: AuthProtocolService.Params) {
    const user = await this.userRepository.getUserByEmailOrUsername({
      email,
    })

    if (!user) {
      return createFailureResponse(APPLICATION_ERRORS.CREDENTIALS_INVALID)
    }

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      return createFailureResponse(APPLICATION_ERRORS.CREDENTIALS_INVALID)
    }

    await this.userRepository.deleteAllAccessToken(user.uuid)

    const userAccessToken = await this.userRepository.createAccessToken(user.uuid)
    return createSuccessResponse(userAccessToken)
  }
}
