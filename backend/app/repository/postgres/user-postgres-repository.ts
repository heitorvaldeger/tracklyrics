import User from '#models/user/user-lucid'
import { UserAccessTokenModel } from '#models/user/user-access-token-model'
import { UserCreateAccessTokenParams } from '../../params/user/user-create-access-token-params.js'
import { UserCreateParams } from '../../params/user/user-create-params.js'
import { UserEmailUsernameFindModel } from '../../params/user/user-email-username-find-params.js'
import { IUserRepository } from '#repository/interfaces/IUserRepository'
import UserLucid from '#models/user/user-lucid'
import { UserModel } from '#models/user/user-model'

export class UserPostgresRepository implements IUserRepository {
  async getUserByEmailOrUsername(payload: UserEmailUsernameFindModel): Promise<UserModel | null> {
    const user = await UserLucid.query()
      .whereLike('email', payload.email ?? '')
      .orWhere('username', payload.username ?? '')
      .select(['uuid', 'username', 'email'])
      .first()

    if (!user) {
      return null
    }

    const { uuid, username, email } = user
    return {
      uuid,
      username,
      email,
    }
  }

  async create(user: UserCreateParams): Promise<UserModel> {
    const { uuid, username, email } = await UserLucid.create(user)
    return {
      uuid,
      username,
      email,
    }
  }

  async createAccessToken(payload: UserCreateAccessTokenParams): Promise<UserAccessTokenModel> {
    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', payload.uuid)
    )

    return {
      type: accessToken.type,
      token: accessToken.value!.release(),
    }
  }
}
