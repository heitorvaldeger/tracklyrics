import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'

import { UserRepository } from '../../infra/db/protocols/user-repository.js'

export abstract class RegisterProtocolService {
  abstract register(
    payload: RegisterProtocolService.Params
  ): Promise<IMethodResponse<UserAccessTokenModel>>
}

export namespace RegisterProtocolService {
  export type Params = Omit<UserRepository.CreateParams, 'uuid'>
}
