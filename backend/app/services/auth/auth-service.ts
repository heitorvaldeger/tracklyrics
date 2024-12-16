import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'
import mail from '@adonisjs/mail/services/main'

import { UserEmailStatus } from '#enums/user-email-status'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { HashAdapter } from '#infra/crypto/protocols/hash-adapter'
import { OTPAdapter } from '#infra/crypto/protocols/otp-adapter'
import { CacheAdapter } from '#infra/db/cache/protocols/cache-adapter'
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
    private readonly hashAdapter: HashAdapter,
    private readonly cacheAdapter: CacheAdapter
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
      const passwordHashed = await this.hashAdapter.createHash(password)
      newUser = await this.userRepository.create({
        uuid: randomUUID(),
        email,
        username,
        password: passwordHashed,
        emailStatus: UserEmailStatus.UNVERIFIED,
        ...rest,
      })
    }

    const codeOTP = await this.otpAdapter.createOTP(newUser.uuid)

    await mail.send(
      new VerifyEmail({
        email,
        username,
        codeOTP,
      })
    )

    await this.cacheAdapter.set(`${newUser.uuid}_${newUser.email}`, codeOTP)

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

    const isPasswordValid = await this.hashAdapter.validateHash(user.password, password)
    if (!isPasswordValid) {
      return createFailureResponse(APPLICATION_MESSAGES.CREDENTIALS_INVALID)
    }

    await this.userRepository.deleteAllAccessToken(user.uuid)

    const userAccessToken = await this.userRepository.createAccessToken(user.uuid)
    return createSuccessResponse(userAccessToken)
  }

  async validateEmail({ email, codeOTP }: AuthProtocolService.ValidateEmailParams) {
    const user = await this.userRepository.getUserByEmailOrUsername({ email })
    if (user && user.emailStatus === UserEmailStatus.VERIFIED) {
      return createFailureResponse(APPLICATION_MESSAGES.EMAIL_HAS_BEEN_VERIFIED)
    }

    if (!user) {
      return createFailureResponse(APPLICATION_MESSAGES.EMAIL_INVALID)
    }

    const codeOTPFromCache = await this.cacheAdapter.get(`${user.uuid}_${user.email}`)
    const isCodeOTPValid = codeOTPFromCache === codeOTP
    if (!codeOTPFromCache || !isCodeOTPValid) {
      return createFailureResponse(APPLICATION_MESSAGES.CODE_OTP_INVALID)
    }

    await this.userRepository.updateEmailStatus(user.uuid)
    return createSuccessResponse({
      uuid: user.uuid,
      emailStatus: UserEmailStatus.VERIFIED,
    })
  }
}
