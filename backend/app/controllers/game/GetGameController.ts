import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IGetGameSchema } from '#core/domain/validators/GetGameSchema'
import { IGameService } from '#services/interfaces/game-service'

@inject()
export default class GetGameController {
  constructor(
    private readonly gameService: IGameService,
    private readonly getGameValidator: IGetGameSchema
  ) {}

  async handle({ request }: HttpContext) {
    const data = await this.getGameValidator.validateAsync(request.params())
    return await this.gameService.getGame(data.uuid, data.mode)
  }
}
