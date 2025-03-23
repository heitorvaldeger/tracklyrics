import { Exception } from '@adonisjs/core/exceptions'

export default class EmailHasBeenVerifiedException extends Exception {
  constructor() {
    super('Your email address has been verified', {
      status: 422,
      code: 'E_EMAIL_HAS_BEEN_VERIFIED',
    })
  }
}
