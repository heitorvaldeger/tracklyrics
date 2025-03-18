import { UserEmailStatus } from '#enums/user-email-status'
import { UserRepository } from '#infra/db/repository/_protocols/user-repository'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import UserLucid from '#models/user-model/user-lucid'
import { UserModel } from '#models/user-model/user-model'
import { UserWithoutPasswordModel } from '#models/user-model/user-without-password-model'

export class UserPostgresRepository implements UserRepository {
  async getUserByEmailOrUsername(
    payload: UserRepository.FindUserByEmailUsernameParams
  ): Promise<UserModel | null> {
    const user = await UserLucid.query()
      .whereLike('email', payload.email ?? '')
      .orWhere('username', payload.username ?? '')
      .select(['uuid', 'username', 'email', 'password', 'email_status'])
      .first()

    if (!user) {
      return null
    }

    const { uuid, username, email, password, emailStatus } = user
    return {
      uuid,
      username,
      email,
      password,
      emailStatus,
    }
  }

  async getUserByEmailWithoutPassword(
    emailAddress: string
  ): Promise<UserWithoutPasswordModel | null> {
    const user = await UserLucid.findBy('email', emailAddress)
    if (!user) {
      return null
    }

    return user.serialize({
      fields: {
        omit: ['password'],
      },
    }) as UserWithoutPasswordModel
  }

  async create(user: UserRepository.CreateParams): Promise<UserModel> {
    const { uuid, username, email, password, emailStatus } = await UserLucid.create(user)
    return {
      uuid,
      username,
      email,
      password,
      emailStatus,
    }
  }

  async createAccessToken(userUuid: string): Promise<UserAccessTokenModel> {
    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', userUuid)
    )

    return {
      type: accessToken.type,
      token: accessToken.value!.release(),
      expiresAt: accessToken.expiresAt,
    }
  }

  async deleteAllAccessToken(userUuid: string): Promise<void> {
    const user = await UserLucid.findByOrFail('uuid', userUuid)
    const accessTokens = await UserLucid.accessTokens.all(user)

    accessTokens.forEach(async (token) => {
      await UserLucid.accessTokens.delete(user, token.identifier)
    })
  }

  async updateEmailStatus(userUuid: string): Promise<void> {
    await UserLucid.query().where('uuid', userUuid).update({
      emailStatus: UserEmailStatus.VERIFIED,
    })
  }
}
