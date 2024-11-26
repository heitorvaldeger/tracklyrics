import { createSuccessResponse } from '#helpers/method-response'
import { IMethodResponse } from '#helpers/types/IMethodResponse'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'
import { UserRegisterRequest } from '#params/user-params/user-register-request'
import { IAuthService } from '#services/interfaces/IAuthService'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'

export const mockAuthServiceStub = () => {
  class AuthServiceStub implements IAuthService {
    private auth: Authenticator<Authenticators> | null = null
    public setAuth(auth: Authenticator<Authenticators>) {
      this.auth = auth
    }

    getUserId(): number {
      return 0
    }

    async register(payload: UserRegisterRequest): Promise<IMethodResponse<UserAccessTokenModel>> {
      return createSuccessResponse({
        type: 'any_type',
        token: 'any_token',
      })
    }
  }

  return new AuthServiceStub()
}
