import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'

import { UserEmailStatus } from '#enums/user-email-status'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { OTPAdapter } from '#infra/crypto/protocols/otp-adapter'
import { RedisAdapter } from '#infra/db/cache/protocols/redis-adapter'
import { UserRepository } from '#infra/db/repository/protocols/user-repository'
import { VerifyEmail } from '#mails/verify-email'
import { UserModel } from '#models/user-model/user-model'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { RegisterProtocolService } from '#services/protocols/register-protocol-service'

@inject()
export class AuthService implements AuthProtocolService, RegisterProtocolService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpAdapter: OTPAdapter,
    private readonly redisAdapter: RedisAdapter
  ) {}

  async register(
    payload: RegisterProtocolService.Params
  ): Promise<IMethodResponse<RegisterProtocolService.UserRegisterModel>> {
    const { password, email, username, ...rest } = payload

    const user = await this.userRepository.getUserByEmailOrUsername({ email, username })
    if (user && user.emailStatus === UserEmailStatus.VERIFIED) {
      return createFailureResponse(APPLICATION_MESSAGES.EMAIL_OR_USERNAME_ALREADY_USING)
    }

    let newUser = user as UserModel

    if (!user) {
      const passwordHashed = await hash.make(password)
      newUser = await this.userRepository.create({
        uuid: randomUUID(),
        email,
        username,
        password: passwordHashed,
        emailStatus: UserEmailStatus.UNVERIFIED,
        ...rest,
      })
    }

    const codeOTP = await this.otpAdapter.create(newUser.uuid)

    await mail.send(
      new VerifyEmail({
        username,
        codeOTP,
      })
    )

    await this.redisAdapter.set(`${newUser.uuid}_${newUser.email}`, codeOTP)

    return createSuccessResponse({
      uuid: newUser.uuid,
      emailStatus: newUser.emailStatus,
    })
  }

  async login({ email, password }: AuthProtocolService.LoginParams) {
    const user = await this.userRepository.getUserByEmailOrUsername({
      email,
    })

    if (!user) {
      return createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID)
    }

    if (user && user.emailStatus === UserEmailStatus.UNVERIFIED) {
      return createFailureResponse(APPLICATION_MESSAGES.EMAIL_PENDING_VALIDATION)
    }

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      return createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID)
    }

    await this.userRepository.deleteAllAccessToken(user.uuid)

    const userAccessToken = await this.userRepository.createAccessToken(user.uuid)
    return createSuccessResponse(userAccessToken)
  }
}
