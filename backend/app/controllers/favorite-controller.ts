import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dispatch } from '#helpers/dispatch'
import { FavoriteProtocolService } from '#services/_protocols/favorite-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class FavoriteController {
  constructor(private readonly favoriteService: FavoriteProtocolService) {}

  async saveFavorite({ request }: HttpContext) {
    try {
      const { uuid } = await uuidValidator.validate(request.params())
      const added = await this.favoriteService.saveFavorite(uuid)
      return dispatch(added)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }

  async removeFavorite({ request }: HttpContext) {
    try {
      const { uuid } = await uuidValidator.validate(request.params())
      const result = await this.favoriteService.removeFavorite(uuid)
      return dispatch(result)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }

  async findFavoritesByUserLogged() {
    try {
      const result = await this.favoriteService.findFavoritesByUserLogged()
      return dispatch(result)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
