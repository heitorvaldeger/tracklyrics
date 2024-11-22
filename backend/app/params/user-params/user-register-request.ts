import { UserCreateParams } from '#params/user-params/user-create-params'

export type UserRegisterRequest = Omit<UserCreateParams, 'uuid'>
