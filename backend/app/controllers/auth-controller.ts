import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IAuthService } from '#services/interfaces/auth-service'

@inject()
export default class AuthController {
  constructor(private readonly authService: IAuthService) {}

  async logout({ response }: HttpContext) {
    await this.authService.logout()
    return response.noContent()
  }
}
