import { badRequest, serverError } from '#helpers/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { registerAuthValidator } from '#validators/auth-validator'
import { errors } from '@vinejs/vine'
import { IRegisterService } from '#services/interfaces/IRegisterService'
import { dispatch } from '#helpers/dispatch'

@inject()
export default class AuthController {
  constructor(private readonly registerService: IRegisterService) {}
  async register({ request }: HttpContext) {
    try {
      const userData = await registerAuthValidator.validate(request.body())
      const response = await this.registerService.register(userData)

      return dispatch(response)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }
}
