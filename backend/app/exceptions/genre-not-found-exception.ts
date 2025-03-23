import { Exception } from '@adonisjs/core/exceptions'

export default class GenreNotFoundException extends Exception {
  constructor() {
    super('Genre not found', {
      status: 404,
      code: 'E_GENRE_NOT_FOUND',
    })
  }
}
