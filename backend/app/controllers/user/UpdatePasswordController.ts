import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IUpdatePasswordSchema } from '#core/domain/validators/UpdatePasswordSchema'
import { IUserService } from '#services/interfaces/user-service'

@inject()
export default class UpdatePasswordController {
  constructor(
    private readonly userService: IUserService,
    private readonly updatePasswordSchema: IUpdatePasswordSchema
  ) {}

  async handle({ request, response }: HttpContext) {
    const { password } = await this.updatePasswordSchema.validateAsync(request.body())

    await this.userService.updatePassword(password)

    return response.noContent()
  }
}
