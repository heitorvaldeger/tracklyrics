import { HttpStatusCode } from '../enums/HttpStatusCode.js'

export const APPLICATION_ERRORS = {
  VIDEO_NOT_FOUND: {
    message: 'Video not found',
    httpCode: HttpStatusCode.NOT_FOUND,
  },
}
