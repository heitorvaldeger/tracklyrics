import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { IUserService } from '#services/interfaces/user-service'
import {
  updatePasswordValidator,
  validateUpdatePasswordValidator,
} from '#validators/vinejs/user-validator'

@inject()
export default class UserController {
  constructor(private readonly userService: IUserService) {}

  async getFullInfoByUserLogged() {
    return await this.userService.getFullInfoByUserLogged()
  }

  async updatePassword({ request, response }: HttpContext) {
    const [errors, data] = await updatePasswordValidator.tryValidate(request.body())

    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    await this.userService.updatePassword(data.password)

    return response.noContent()
  }

  async validateUpdatePassword({ request, response }: HttpContext) {
    const [errors, data] = await validateUpdatePasswordValidator.tryValidate(request.body())

    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    await this.userService.validateUpdatePassword(data.codeOTP)

    return response.noContent()
  }
}
