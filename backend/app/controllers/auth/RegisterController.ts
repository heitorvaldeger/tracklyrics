import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IAuthService } from '#services/interfaces/auth-service'
import { IRegisterSchema } from '#validators/auth/interfaces/RegisterSchema'

@inject()
export default class RegisterController {
  constructor(
    private readonly authService: IAuthService,
    private readonly registerSchema: IRegisterSchema
  ) {}

  async handle({ request }: HttpContext) {
    const payload = await this.registerSchema.validateAsync(request.body())
    return await this.authService.register(payload)
  }
}
