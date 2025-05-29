import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IAuthService } from '#services/interfaces/auth-service'

@inject()
export default class LogoutController {
  constructor(private readonly authService: IAuthService) {}

  async handle({ response }: HttpContext) {
    await this.authService.logout()
    return response.noContent()
  }
}
