import { UserEmailStatus } from '#enums/user-email-status'
import {
  EmailUsername,
  IUserRepository,
  UserBasic,
  UserWithoutPassword,
} from '#infra/db/repository/interfaces/user-repository'
import { User } from '#models/user'

export class UserPostgresRepository implements IUserRepository {
  async getUserByEmailOrUsername(payload: EmailUsername) {
    const user = await User.query()
      .whereLike('email', payload.email ?? '')
      .orWhere('username', payload.username ?? '')
      .select(['uuid', 'username', 'email', 'password', 'email_status'])
      .first()

    return user
  }

  async getUserByEmailWithoutPassword(emailAddress: string) {
    const user = await User.findBy('email', emailAddress)
    if (!user) {
      return null
    }

    return user.serialize({
      fields: {
        omit: ['password'],
      },
    }) as UserWithoutPassword
  }

  async create(user: UserBasic) {
    const newUser = await User.create(user)
    return newUser.serialize() as UserBasic
  }

  async createAccessToken(userUuid: string) {
    const accessToken = await User.accessTokens.create(await User.findByOrFail('uuid', userUuid))

    return {
      type: accessToken.type,
      token: accessToken.value!.release(),
      expiresAt: accessToken.expiresAt,
    }
  }

  async deleteAllAccessToken(userUuid: string): Promise<void> {
    const user = await User.findByOrFail('uuid', userUuid)
    const accessTokens = await User.accessTokens.all(user)

    accessTokens.forEach(async (token) => {
      await User.accessTokens.delete(user, token.identifier)
    })
  }

  async updateEmailStatus(userUuid: string): Promise<void> {
    await User.query().where('uuid', userUuid).update({
      emailStatus: UserEmailStatus.VERIFIED,
    })
  }
}
