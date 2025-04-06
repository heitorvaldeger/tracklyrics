import { Exception } from '@adonisjs/core/exceptions'

export default class YoutubeLinkAlreadyExistsException extends Exception {
  constructor() {
    super('Youtube link already exists in database', {
      status: 409,
      code: 'E_YOUTUBE_LINK_ALREADY_EXISTS',
    })
  }
}
