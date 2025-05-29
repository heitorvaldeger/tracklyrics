import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IAuthService } from '#services/interfaces/auth-service'
import { validateEmailValidator } from '#validators/vinejs/auth-validator'

@inject()
export default class AuthController {
  constructor(private readonly authService: IAuthService) {}

  async logout({ response }: HttpContext) {
    await this.authService.logout()
    return response.noContent()
  }

  async validateEmail({ request, response }: HttpContext) {
    const [errors, data] = await validateEmailValidator.tryValidate(request.body())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.authService.validateEmail(data)
  }
}
