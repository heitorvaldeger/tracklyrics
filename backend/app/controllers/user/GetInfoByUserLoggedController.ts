import { inject } from '@adonisjs/core'

import { IUserService } from '#services/interfaces/user-service'

@inject()
export default class GetInfoByUserLoggedController {
  constructor(private readonly userService: IUserService) {}

  async handle() {
    return await this.userService.getFullInfoByUserLogged()
  }
}
