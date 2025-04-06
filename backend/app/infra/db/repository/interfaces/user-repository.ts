import { UserEmailStatus } from '#enums/user-email-status'

export interface UserAccessToken {
  type: string
  token: string
  expiresAt: Date | null
}

export interface UserBasic {
  uuid: string
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
  emailStatus: UserEmailStatus
}

export interface UserWithoutPassword extends Omit<UserBasic, 'password'> {}
export interface EmailUsername extends Partial<Pick<UserBasic, 'email' | 'username'>> {}

export abstract class IUserRepository {
  abstract create(user: UserBasic): Promise<UserBasic>
  abstract getUserByEmailOrUsername(payload: EmailUsername): Promise<UserBasic | null>
  abstract getUserByEmailWithoutPassword(emailAddress: string): Promise<UserWithoutPassword | null>
  abstract createAccessToken(userUuid: string): Promise<UserAccessToken>
  abstract deleteAllAccessToken(userUuid: string): Promise<void>
  abstract updateEmailStatus(userUuid: string): Promise<void>
}
