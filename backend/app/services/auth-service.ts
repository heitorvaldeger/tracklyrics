import { inject } from '@adonisjs/core'
import { IAuthService } from './interfaces/IAuthService.js'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { IRegisterService } from './interfaces/IRegisterService.js'
import hash from '@adonisjs/core/services/hash'
import { IUserRepository } from '#repository/interfaces/IUserRepository'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { randomUUID } from 'node:crypto'
import { UserRegisterRequest } from '#params/user-params/user-register-request'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'

@inject()
export class AuthService implements IAuthService, IRegisterService {
  private auth: Authenticator<Authenticators> | null = null

  constructor(private readonly userRepository: IUserRepository) {}

  public setAuth(auth: Authenticator<Authenticators>) {
    this.auth = auth
  }

  getUserId(): number {
    return Number(this.auth?.user?.id ?? -1)
  }

  async register(payload: UserRegisterRequest): Promise<IMethodResponse<UserAccessTokenModel>> {
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

    const userAccessToken = await this.userRepository.createAccessToken({ uuid })
    return createSuccessResponse(userAccessToken)
  }
}
