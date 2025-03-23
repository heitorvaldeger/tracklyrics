import { Exception } from '@adonisjs/core/exceptions'

export default class UnauthorizedException extends Exception {
  constructor() {
    super('Unauthorized access', {
      status: 401,
      code: 'E_UNAUTHORIZED',
    })
  }
}
