import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import { UserRegisterRequest } from '#params/user-params/user-register-request'

export abstract class IRegisterService {
  abstract register(payload: UserRegisterRequest): Promise<IMethodResponse<UserAccessTokenModel>>
}
