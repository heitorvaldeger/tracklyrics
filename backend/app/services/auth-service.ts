import { randomUUID } from 'node:crypto'

import { inject } from '@adonisjs/core'
import mail from '@adonisjs/mail/services/main'

import { Auth } from '#core/infra/auth/interfaces/auth'
import { IHashAdapter } from '#core/infra/crypto/interfaces/hash-adapter'
import { IOTPAdapter } from '#core/infra/crypto/interfaces/otp-adapter'
import { ICacheAdapter } from '#core/infra/db/cache/interfaces/cache-adapter'
import { IUserRepository } from '#core/infra/db/repository/interfaces/user-repository'
import { VerifyEmail } from '#core/infra/mail/views/verify-email'
import { UserEmailStatus } from '#enums/user-email-status'
import CodeOtpInvalidException from '#exceptions/code-otp-invalid-exception'
import EmailHasBeenVerifiedException from '#exceptions/email-has-been-verified-exception'
import EmailInvalidException from '#exceptions/email-invalid-exception'
import UserOrEmailAlreadyUsingException from '#exceptions/user-or-email-already-using-exception'
import { IAuthService } from '#services/interfaces/auth-service'

@inject()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpAdapter: IOTPAdapter,
    private readonly hashAdapter: IHashAdapter,
    private readonly cacheAdapter: ICacheAdapter,
    private readonly auth: Auth
  ) {}

  async register(payload: IAuthService.RegisterParams) {
    const { password, email, username, ...rest } = payload

    const user = await this.userRepository.getUserByEmailOrUsername({ email, username })
    if (user && user.emailStatus === UserEmailStatus.VERIFIED) {
      throw new UserOrEmailAlreadyUsingException()
    }

    let newUser = user

    if (!newUser) {
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

  async login({ email, password }: IAuthService.LoginParams) {
    await this.auth.login(email, password)
  }

  async logout() {
    await this.auth.logout()
  }

  async validateEmail({ email, codeOTP }: IAuthService.ValidateEmailParams) {
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
