import { UserEmailStatus } from '#enums/user-email-status'

export type UserModel = {
  uuid: string
  username: string
  email: string
  password: string
  emailStatus?: UserEmailStatus
}
