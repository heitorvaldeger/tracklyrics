import type { HttpContext } from '@adonisjs/core/http'
import { uuidVideoValidator } from '#validators/video-validator'
import { inject } from '@adonisjs/core'
import { dispatch } from '#helpers/dispatch'
import { FavoriteProtocolService } from '#services/protocols/favorite-protocol-service'

@inject()
export default class FavoriteController {
  constructor(private readonly favoriteService: FavoriteProtocolService) {}

  async addFavorite({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const added = await this.favoriteService.addFavorite(uuid)
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
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const result = await this.favoriteService.removeFavorite(uuid)
      return dispatch(result)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
