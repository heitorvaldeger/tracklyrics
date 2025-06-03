import { inject } from '@adonisjs/core'

import { IFavoriteService } from '#services/interfaces/favorite-service'

@inject()
export default class FindFavoritesByUserLoggedController {
  constructor(private readonly favoriteService: IFavoriteService) {}

  async handle() {
    return await this.favoriteService.findFavoritesByUserLogged()
  }
}
