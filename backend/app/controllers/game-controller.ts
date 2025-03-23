import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { GameProtocolService } from '#services/_protocols/game-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class GameController {
  constructor(private readonly gameService: GameProtocolService) {}

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
}
