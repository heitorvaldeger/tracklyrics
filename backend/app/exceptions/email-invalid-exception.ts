import { Exception } from '@adonisjs/core/exceptions'

export default class EmailInvalidException extends Exception {
  constructor() {
    super('Your email address is invalid', {
      status: 422,
      code: 'E_EMAIL_INVALID',
    })
  }
}
