import { Exception } from '@adonisjs/core/exceptions'

export default class LanguageNotFoundException extends Exception {
  constructor() {
    super('Language not found', {
      status: 404,
      code: 'E_LANGUAGE_NOT_FOUND',
    })
  }
}
