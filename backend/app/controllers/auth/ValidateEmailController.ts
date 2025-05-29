import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IAuthService } from '#services/interfaces/auth-service'
import { IValidateEmailSchema } from '#validators/auth/interfaces/ValidateEmailSchema'

@inject()
export default class ValidateEmailController {
  constructor(
    private readonly authService: IAuthService,
    private readonly validateEmailSchema: IValidateEmailSchema
  ) {}

  async handle({ request }: HttpContext) {
    const payload = await this.validateEmailSchema.validateAsync(request.body())
    return await this.authService.validateEmail(payload)
  }
}
