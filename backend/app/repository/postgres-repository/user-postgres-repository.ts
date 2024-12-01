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
      .select(['uuid', 'username', 'email', 'password'])
      .first()

    if (!user) {
      return null
    }

    const { uuid, username, email, password } = user
    return {
      uuid,
      username,
      email,
      password,
    }
  }

  async create(user: UserRepository.CreateParams): Promise<UserModel> {
    const { uuid, username, email, password } = await UserLucid.create(user)
    return {
      uuid,
      username,
      email,
      password,
    }
  }

  async createAccessToken(userUuid: string): Promise<UserAccessTokenModel> {
    const accessToken = await UserLucid.accessTokens.create(
      await UserLucid.findByOrFail('uuid', userUuid)
    )

    return {
      type: accessToken.type,
      token: accessToken.value!.release(),
    }
  }

  async deleteAllAccessToken(userUuid: string): Promise<void> {
    const user = await UserLucid.findByOrFail('uuid', userUuid)
    const accessTokens = await UserLucid.accessTokens.all(user)

    accessTokens.forEach(async (token) => {
      await UserLucid.accessTokens.delete(user, token.identifier)
    })
  }
}
