import { badRequest, noContent, ok, serverError, unprocessable } from '#helpers/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { registerAuthValidator } from '#validators/AuthValidator'
import { errors } from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { randomUUID } from 'node:crypto'
import { uuidVideoValidator } from '#validators/VideoValidator'

@inject()
export default class AuthController {
  async register({ request }: HttpContext) {
    try {
      const { password, email, username, ...rest } = await registerAuthValidator.validate(
        request.body()
      )
      const passwordHashed = await hash.make(password)

      const user = await User.query().where('email', email).orWhere('username', username).first()
      if (user) {
        return unprocessable({
          message: 'Email or username already in use. Please choose another.',
        })
      }

      const newUser = await User.create({
        uuid: randomUUID(),
        email,
        username,
        password: passwordHashed,
        ...rest,
      })

      const token = await User.accessTokens.create(newUser)

      return ok(token)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }

  async find({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())

      const userInDb = await User.query().where('uuid', uuid).first()

      if (!userInDb) {
        return badRequest({
          message: 'Não foi encontrado nenhum caba',
        })
      }

      return ok(userInDb.serialize())
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }
}
