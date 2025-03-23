import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'
import mail from '@adonisjs/mail/services/main'

import { UserEmailStatus } from '#enums/user-email-status'
import CodeOtpInvalidException from '#exceptions/code-otp-invalid-exception'
import EmailHasBeenVerifiedException from '#exceptions/email-has-been-verified-exception'
import EmailInvalidException from '#exceptions/email-invalid-exception'
import EmailPendingValidationException from '#exceptions/email-pending-validation-exception'
import InvalidCredentialsException from '#exceptions/invalid-credentials-exception'
import UserOrEmailAlreadyUsingException from '#exceptions/user-or-email-already-using-exception'
import { HashAdapter } from '#infra/crypto/_protocols/hash-adapter'
import { OTPAdapter } from '#infra/crypto/_protocols/otp-adapter'
import { CacheAdapter } from '#infra/db/cache/_protocols/cache-adapter'
import { UserRepository } from '#infra/db/repository/_protocols/user-repository'
import { VerifyEmail } from '#infra/mail/views/verify-email'
import { UserModel } from '#models/user-model/user-model'
import { AuthProtocolService } from '#services/_protocols/auth-protocol-service'

@inject()
export class AuthService implements AuthProtocolService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpAdapter: OTPAdapter,
    private readonly hashAdapter: HashAdapter,
    private readonly cacheAdapter: CacheAdapter
  ) {}

  async register(payload: AuthProtocolService.RegisterParams) {
    const { password, email, username, ...rest } = payload

    const user = await this.userRepository.getUserByEmailOrUsername({ email, username })
    if (user && user.emailStatus === UserEmailStatus.VERIFIED) {
      throw new UserOrEmailAlreadyUsingException()
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

    await mail.sendLater(
      new VerifyEmail({
        email,
        username,
        codeOTP,
      })
    )

    await this.cacheAdapter.set(`${newUser.uuid}_${newUser.email}`, codeOTP, 600)

    return {
      uuid: newUser.uuid,
      emailStatus: newUser.emailStatus,
    }
  }

  async login({ email, password }: AuthProtocolService.LoginParams) {
    const user = await this.userRepository.getUserByEmailOrUsername({
      email,
    })

    if (!user) {
      throw new InvalidCredentialsException()
    }

    if (user && user.emailStatus === UserEmailStatus.UNVERIFIED) {
      throw new EmailPendingValidationException()
    }

    const isPasswordValid = await this.hashAdapter.validateHash(user.password, password)
    if (!isPasswordValid) {
      throw new InvalidCredentialsException()
    }

    await this.userRepository.deleteAllAccessToken(user.uuid)

    return await this.userRepository.createAccessToken(user.uuid)
  }

  async validateEmail({ email, codeOTP }: AuthProtocolService.ValidateEmailParams) {
    const user = await this.userRepository.getUserByEmailOrUsername({ email })
    if (user && user.emailStatus === UserEmailStatus.VERIFIED) {
      throw new EmailHasBeenVerifiedException()
    }

    if (!user) {
      throw new EmailInvalidException()
    }

    const cacheKey = `${user.uuid}_${user.email}`
    const codeOTPFromCache = await this.cacheAdapter.get(cacheKey)
    const isCodeOTPValid = codeOTPFromCache === codeOTP
    if (!codeOTPFromCache || !isCodeOTPValid) {
      throw new CodeOtpInvalidException()
    }

    await this.userRepository.updateEmailStatus(user.uuid)
    await this.cacheAdapter.delete(cacheKey)
    return {
      uuid: user.uuid,
      emailStatus: UserEmailStatus.VERIFIED,
    }
  }
}
