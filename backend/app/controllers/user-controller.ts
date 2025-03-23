import { inject } from '@adonisjs/core'

import { UserProtocolService } from '#services/_protocols/user-protocol-service'

@inject()
export default class UserController {
  constructor(private readonly userService: UserProtocolService) {}

  async getFullInfoByUserLogged() {
    return await this.userService.getFullInfoByUserLogged()
  }
}
