import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IUUIDValidatorSchema } from '#core/domain/validators/UUIDValidatorSchema'
import { IGameService } from '#services/interfaces/game-service'

@inject()
export default class GetModesGameController {
  constructor(
    private readonly gameService: IGameService,
    private readonly uuidValidatorSchema: IUUIDValidatorSchema
  ) {}

  async handle({ request }: HttpContext) {
    const { uuid } = await this.uuidValidatorSchema.validateAsync(request.params())
    return await this.gameService.getModes(uuid)
  }
}
