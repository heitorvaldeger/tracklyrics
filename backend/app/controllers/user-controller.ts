import { badRequest, notFound, ok, serverError } from '#helpers/http'
import UserLucid from '#models/user/user-lucid'
import User from '#models/user/user-lucid'
import { uuidVideoValidator } from '#validators/video-validator'
import { type HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class UserController {
  async find({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())

      const user = await UserLucid.query().where('uuid', uuid).first()

      if (!user) {
        return notFound({})
      }

      return ok(user.serialize())
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }
}
