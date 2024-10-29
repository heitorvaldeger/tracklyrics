import { ok } from '#helpers/http'
import { inject } from '@adonisjs/core'
import { IGenrerService } from '#services/interfaces/IGenrerService'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  async register({ request }: HttpContext) {}
}
