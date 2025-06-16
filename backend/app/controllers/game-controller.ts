import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IGameService } from '#services/interfaces/game-service'
import { gameValidator } from '#validators/vinejs/game-validator'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class GameController {
  constructor(private readonly gameService: IGameService) {}

  async play({ request, response }: HttpContext) {
    const [errors, data] = await uuidValidator.tryValidate(request.params())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }

    await this.gameService.play(data.uuid)
    return response.noContent()
  }

  async getModes({ request, response }: HttpContext) {
    const [errors, data] = await uuidValidator.tryValidate(request.params())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.gameService.getModes(data.uuid)
  }

  async getGame({ request, response }: HttpContext) {
    const [errors, data] = await gameValidator.tryValidate(request.params())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.gameService.getGame(data.uuid, data.mode)
  }
}
