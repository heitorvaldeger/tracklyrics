import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { ISignInSchema } from '#core/domain/validators/SignInSchema'
import { IAuthService } from '#services/interfaces/auth-service'

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
