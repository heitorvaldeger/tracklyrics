import { inject } from '@adonisjs/core'

import { dispatch } from '#helpers/dispatch'
import { UserProtocolService } from '#services/_protocols/user-protocol-service'

@inject()
export default class UserController {
  constructor(private readonly userService: UserProtocolService) {}

  async getFullInfoByUserLogged() {
    try {
      const user = await this.userService.getFullInfoByUserLogged()

      return dispatch(user)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
