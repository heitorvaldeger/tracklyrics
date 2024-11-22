import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import User from '#models/user-model/user-lucid'
import { UserModel } from '#models/user-model/user-model'
import { UserCreateAccessTokenParams } from '#params/user-params/user-create-access-token-params'
import { UserCreateParams } from '#params/user-params/user-create-params'

export abstract class IUserRepository {
  abstract getUserByEmailOrUsername(payload: any): Promise<UserModel | null>
  abstract create(user: UserCreateParams): Promise<UserModel>
  abstract createAccessToken(payload: UserCreateAccessTokenParams): Promise<UserAccessTokenModel>
}
