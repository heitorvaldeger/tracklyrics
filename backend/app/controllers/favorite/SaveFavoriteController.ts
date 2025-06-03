import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IUUIDValidatorSchema } from '#core/domain/validators/UUIDValidatorSchema'
import { IFavoriteService } from '#services/interfaces/favorite-service'

@inject()
export default class SaveFavoriteController {
  constructor(
    private readonly favoriteService: IFavoriteService,
    private readonly uuidValidatorSchema: IUUIDValidatorSchema
  ) {}

  async handle({ request }: HttpContext) {
    const { uuid } = await this.uuidValidatorSchema.validateAsync(request.params())
    return await this.favoriteService.saveFavorite(uuid)
  }
}
