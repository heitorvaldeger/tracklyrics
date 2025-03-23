import { Exception } from '@adonisjs/core/exceptions'

export default class UserOrEmailAlreadyUsingException extends Exception {
  constructor() {
    super('Email or username already in use. Please choose another.', {
      status: 422,
      code: 'E_EMAIL_OR_USERNAME_ALREADY_USING',
    })
  }
}
