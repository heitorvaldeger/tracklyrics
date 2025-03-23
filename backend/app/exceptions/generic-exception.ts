import { Exception } from '@adonisjs/core/exceptions'

export default class GenericException extends Exception {
  constructor() {
    super('An error occurred!', {
      status: 500,
      code: 'E_GENERIC_EXCEPTION',
    })
  }
}
