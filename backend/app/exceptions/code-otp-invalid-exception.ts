import { Exception } from '@adonisjs/core/exceptions'

export default class CodeOtpInvalidException extends Exception {
  constructor() {
    super('Code OTP is invalid', {
      status: 422,
      code: 'E_CODE_OTP_INVALID',
    })
  }
}
