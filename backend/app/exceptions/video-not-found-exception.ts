import { Exception } from '@adonisjs/core/exceptions'

export default class VideoNotFoundException extends Exception {
  constructor() {
    super('Video not found', {
      status: 404,
      code: 'E_VIDEO_NOT_FOUND',
    })
  }
}
