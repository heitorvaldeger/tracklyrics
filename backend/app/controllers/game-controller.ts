import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dispatch } from '#helpers/dispatch'
import { GameProtocolService } from '#services/protocols/game-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class GameController {
  constructor(private readonly gameService: GameProtocolService) {}

  async play({ request }: HttpContext) {
    try {
      const { uuid } = await uuidValidator.validate(request.params())
      const played = await this.gameService.play(uuid)
      return dispatch(played)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }

  async getModes({ request }: HttpContext) {
    try {
      const { uuid } = await uuidValidator.validate(request.params())
      const modes = await this.gameService.getModes(uuid)
      return dispatch(modes)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
