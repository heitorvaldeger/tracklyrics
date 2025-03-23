import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { FavoriteProtocolService } from '#services/_protocols/favorite-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class FavoriteController {
  constructor(private readonly favoriteService: FavoriteProtocolService) {}

  async saveFavorite({ request, response }: HttpContext) {
    const [errors, data] = await uuidValidator.tryValidate(request.params())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.favoriteService.saveFavorite(data.uuid)
  }

  async removeFavorite({ request, response }: HttpContext) {
    const [errors, data] = await uuidValidator.tryValidate(request.params())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.favoriteService.removeFavorite(data.uuid)
  }

  async findFavoritesByUserLogged() {
    return await this.favoriteService.findFavoritesByUserLogged()
  }
}
