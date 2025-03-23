import { Exception } from '@adonisjs/core/exceptions'

export default class EmailPendingValidationException extends Exception {
  constructor() {
    super('Your email address is pending of validation', {
      status: 422,
      code: 'E_EMAIL_PENDING_VALIDATION',
    })
  }
}
