import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IAuthService } from '#services/interfaces/auth-service'
import { ISignInSchema } from '#validators/auth/interfaces/SignInSchema'
import {
  loginAuthValidator,
  registerAuthValidator,
  validateEmailValidator,
} from '#validators/vinejs/auth-validator'

@inject()
export default class AuthController {
  constructor(
    private readonly authService: IAuthService,
    private readonly signInSchema: ISignInSchema
  ) {}

  async register({ request, response }: HttpContext) {
    const [errors, data] = await registerAuthValidator.tryValidate(request.body())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.authService.register(data)
  }

  async login({ request, response }: HttpContext) {
    const payload = await this.signInSchema.validateAsync(request.body())

    await this.authService.login(payload)

    return response.noContent()
  }

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
