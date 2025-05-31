import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IValidateEmailSchema } from '#core/domain/validators/ValidateEmailSchema'
import { IAuthService } from '#services/interfaces/auth-service'

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
