import { UserAccessTokenModel } from '#models/user/user-access-token-model'
import User from '#models/user/user-lucid'
import { UserModel } from '#models/user/user-model'
import { UserCreateAccessTokenParams } from '#params/user/user-create-access-token-params'
import { UserCreateParams } from '../../params/user/user-create-params.js'

export abstract class IUserRepository {
  abstract getUserByEmailOrUsername(payload: any): Promise<UserModel | null>
  abstract create(user: UserCreateParams): Promise<UserModel>
  abstract createAccessToken(payload: UserCreateAccessTokenParams): Promise<UserAccessTokenModel>
}
