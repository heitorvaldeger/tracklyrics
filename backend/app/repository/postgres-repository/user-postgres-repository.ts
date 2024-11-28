import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import { UserRepository } from '#repository/protocols/user-repository'
import UserLucid from '#models/user-model/user-lucid'
import { UserModel } from '#models/user-model/user-model'

export class UserPostgresRepository implements UserRepository {
  async getUserByEmailOrUsername(
    payload: UserRepository.FindUserByEmailUsernameParams
  ): Promise<UserModel | null> {
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

  async create(user: UserRepository.CreateParams): Promise<UserModel> {
    const { uuid, username, email } = await UserLucid.create(user)
    return {
      uuid,
      username,
      email,
    }
  }

  async createAccessToken(
    payload: UserRepository.CreateAccessTokenParams
  ): Promise<UserAccessTokenModel> {
    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', payload.uuid)
    )

    return {
      type: accessToken.type,
      token: accessToken.value!.release(),
    }
  }
}
