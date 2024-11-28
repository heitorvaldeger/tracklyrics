import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import { UserModel } from '#models/user-model/user-model'

export abstract class UserRepository {
  abstract create(user: UserRepository.CreateParams): Promise<UserModel>
  abstract getUserByEmailOrUsername(
    payload: UserRepository.FindUserByEmailUsernameParams
  ): Promise<UserModel | null>
  abstract createAccessToken(
    payload: UserRepository.CreateAccessTokenParams
  ): Promise<UserAccessTokenModel>
}

export namespace UserRepository {
  export type CreateAccessTokenParams = {
    uuid: string
  }

  export type CreateParams = {
    uuid: string
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
  }

  export type FindUserByEmailUsernameParams = {
    email?: string
    username?: string
  }
}
