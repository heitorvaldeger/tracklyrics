import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'

import { UserEmailStatus } from '#enums/user-email-status'
import { createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import { AuthProtocolService } from '#services/protocols/auth-protocol-service'
import { RegisterProtocolService } from '#services/protocols/register-protocol-service'

export const mockAuthServiceStub = () => {
  class AuthServiceStub implements AuthProtocolService {
    private auth: Authenticator<Authenticators> | null = null
    public setAuth(auth: Authenticator<Authenticators>) {
      this.auth = auth
    }

    getUserId(): number {
      return 0
    }

    async register(
      payload: RegisterProtocolService.Params
    ): Promise<IMethodResponse<RegisterProtocolService.UserRegisterModel>> {
      return createSuccessResponse({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.UNVERIFIED,
      })
    }

    async login(
      params: AuthProtocolService.LoginParams
    ): Promise<IMethodResponse<UserAccessTokenModel>> {
      return createSuccessResponse({
        type: 'any_type',
        token: 'any_token',
      })
    }
  }

  return new AuthServiceStub()
}
