import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IAuthService } from '#services/interfaces/auth-service'
import { ISignInSchema } from '#validators/auth/interfaces/SignInSchema'

@inject()
export default class LoginController {
  constructor(
    private readonly authService: IAuthService,
    private readonly signInSchema: ISignInSchema
  ) {}

  async handle({ request, response }: HttpContext) {
    const payload = await this.signInSchema.validateAsync(request.body())

    await this.authService.login(payload)

    return response.noContent()
  }
}
