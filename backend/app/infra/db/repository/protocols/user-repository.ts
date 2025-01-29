import { UserEmailStatus } from '#enums/user-email-status'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import { UserModel } from '#models/user-model/user-model'
import { UserWithoutPasswordModel } from '#models/user-model/user-without-password-model'

export abstract class UserRepository {
  abstract create(user: UserRepository.CreateParams): Promise<UserModel>
  abstract getUserByEmailOrUsername(
    payload: UserRepository.FindUserByEmailUsernameParams
  ): Promise<UserModel | null>
  abstract getUserByEmailWithoutPassword(
    emailAddress: string
  ): Promise<UserWithoutPasswordModel | null>
  abstract createAccessToken(userUuid: string): Promise<UserAccessTokenModel>
  abstract deleteAllAccessToken(userUuid: string): Promise<void>
  abstract updateEmailStatus(userUuid: string): Promise<void>
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
    emailStatus: UserEmailStatus
  }

  export type FindUserByEmailUsernameParams = {
    email?: string
    username?: string
  }
}
