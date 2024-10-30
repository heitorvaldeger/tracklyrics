import { badRequest, notFound, ok, serverError } from '#helpers/http'
import User from '#models/user'
import { uuidVideoValidator } from '#validators/VideoValidator'
import { type HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class UserController {
  async find({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())

      const user = await User.query().where('uuid', uuid).first()

      if (!user) {
        return notFound()
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
