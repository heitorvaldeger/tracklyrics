import { Exception } from '@adonisjs/core/exceptions'

export default class UserNotFoundException extends Exception {
  constructor() {
    super('User not found', {
      status: 404,
      code: 'E_USER_NOTFOUND',
    })
  }
}
