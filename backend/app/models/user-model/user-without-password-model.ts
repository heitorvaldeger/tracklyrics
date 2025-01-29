import { UserEmailStatus } from '#enums/user-email-status'

export type UserWithoutPasswordModel = {
  uuid: string
  username: string
  email: string
  firstName: string
  lastName: string
  emailStatus: UserEmailStatus
}
