import { badRequest, noContent, ok, serverError } from '#helpers/http'
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
      const user = await registerAuthValidator.validate(request.body())
      user.password = await hash.make(user.password)

      const userInDb = await User.query()
        .where('email', user.email)
        .orWhere('username', user.username)
        .first()

      if (userInDb) {
        return badRequest({
          message: 'Já existe um caba cadastrado',
        })
      }

      const newUser = await User.create({
        ...user,
        uuid: randomUUID(),
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
