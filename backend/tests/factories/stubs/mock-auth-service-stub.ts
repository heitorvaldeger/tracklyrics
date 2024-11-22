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
  }

  return new AuthServiceStub()
}
