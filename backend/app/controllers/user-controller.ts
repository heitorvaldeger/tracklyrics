import { inject } from '@adonisjs/core'

import { IUserService } from '#services/interfaces/user-service'

@inject()
export default class UserController {
  constructor(private readonly userService: IUserService) {}

  async getFullInfoByUserLogged() {
    return await this.userService.getFullInfoByUserLogged()
  }
}
