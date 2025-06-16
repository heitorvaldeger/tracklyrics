import { inject } from '@adonisjs/core'
import mail from '@adonisjs/mail/services/main'

import { Auth } from '#core/infra/auth/interfaces/auth'
import { IHashAdapter } from '#core/infra/crypto/interfaces/hash-adapter'
import { IOTPAdapter } from '#core/infra/crypto/interfaces/otp-adapter'
import { ICacheAdapter } from '#core/infra/db/cache/interfaces/cache-adapter'
import { IUserRepository, UserBasic } from '#core/infra/db/repository/interfaces/user-repository'
import { UpdatePassword } from '#core/infra/mail/views/update-password'
import CodeOtpInvalidException from '#exceptions/code-otp-invalid-exception'
import UserNotFoundException from '#exceptions/user-not-found-exception'
import { IUserService } from '#services/interfaces/user-service'

@inject()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly auth: Auth,
    private readonly hash: IHashAdapter,
    private readonly otp: IOTPAdapter,
    private readonly cache: ICacheAdapter
  ) {}

  async getFullInfoByUserLogged() {
    const userEmail = this.auth.getUserEmail()!

    const user = await this.userRepository.getUserByEmailWithoutPassword(userEmail)
    if (!user) {
      throw new UserNotFoundException()
    }

    return user
  }

  async updatePassword(newPassword: string) {
    const user = this.auth.getUser<UserBasic>()
    if (!user) return

    const cacheKey = `${user.uuid}-update-password`
    const newPasswordHashed = await this.hash.createHash(newPassword)
    const codeOTP = await this.otp.createOTP(user.uuid)

    const hasDataCache = !!(await this.cache.get(cacheKey))
    if (hasDataCache) {
      await this.cache.delete(cacheKey)
    }
    await this.cache.set(
      cacheKey,
      JSON.stringify({
        password: newPasswordHashed,
        codeOTP,
      }),
      300
    )

    await mail.sendLater(
      new UpdatePassword({
        email: user.email,
        username: user.username,
        codeOTP,
      })
    )
  }

  async validateUpdatePassword(codeOTP: string) {
    const user = this.auth.getUser<UserBasic>()
    if (!user) return

    const cacheKey = `${user.uuid}-update-password`
    const dataCache: {
      password: string
      codeOTP: string
    } = JSON.parse((await this.cache.get(cacheKey)) ?? '{}')

    if (codeOTP !== dataCache.codeOTP) {
      throw new CodeOtpInvalidException()
    }

    await this.cache.delete(cacheKey)

    await this.userRepository.updatePassword(user.uuid, dataCache.password)
  }
}
