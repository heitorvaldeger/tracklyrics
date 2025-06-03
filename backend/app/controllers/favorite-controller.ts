import { inject } from '@adonisjs/core'

import { IFavoriteService } from '#services/interfaces/favorite-service'

@inject()
export default class FavoriteController {
  constructor(private readonly favoriteService: IFavoriteService) {}

  async findFavoritesByUserLogged() {
    return await this.favoriteService.findFavoritesByUserLogged()
  }
}
