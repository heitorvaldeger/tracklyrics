import { Exception } from '@adonisjs/core/exceptions'

export default class InvalidCredentialsException extends Exception {
  constructor() {
    super('Invalid credentials', {
      status: 401,
      code: 'E_INVALID_CREDENTIALS',
    })
  }
}
