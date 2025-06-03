import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IValidateUpdatePasswordSchema } from '#core/domain/validators/ValidateUpdatePasswordSchema'
import { IUserService } from '#services/interfaces/user-service'

@inject()
export default class ValidateUpdatePasswordController {
  constructor(
    private readonly userService: IUserService,
    private readonly validateUpdatePasswordSchema: IValidateUpdatePasswordSchema
  ) {}

  async handle({ request, response }: HttpContext) {
    const { codeOTP } = await this.validateUpdatePasswordSchema.validateAsync(request.body())

    await this.userService.validateUpdatePassword(codeOTP)

    return response.noContent()
  }
}
