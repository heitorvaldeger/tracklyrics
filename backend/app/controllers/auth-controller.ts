import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { dispatch } from '#helpers/dispatch'
import { AuthProtocolService } from '#services/_protocols/auth-protocol-service'
import {
  loginAuthValidator,
  registerAuthValidator,
  validateEmailValidator,
} from '#validators/vinejs/auth-validator'

@inject()
export default class AuthController {
  constructor(private readonly authService: AuthProtocolService) {}
  async register({ request }: HttpContext) {
    try {
      const body = await registerAuthValidator.validate(request.body())
      const response = await this.authService.register(body)

      return dispatch(response)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }

  async login({ request }: HttpContext) {
    try {
      const body = await loginAuthValidator.validate(request.body())
      const response = await this.authService.login(body)

      return dispatch(response)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }

  async validateEmail({ request }: HttpContext) {
    try {
      const body = await validateEmailValidator.validate(request.body())
      const response = await this.authService.validateEmail(body)

      return dispatch(response)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
