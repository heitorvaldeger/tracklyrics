import { HttpStatusCode } from '#enums/http-status-code'

export const APPLICATION_ERRORS = {
  VIDEO_NOT_FOUND: {
    message: 'Video not found',
    httpCode: HttpStatusCode.NOT_FOUND,
  },
  VIDEO_UNPOSSIBLE_ADD_TO_FAVORITE: {
    message: 'It was not possible to add the video to favorites.',
    httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
  },
  VIDEO_UNPOSSIBLE_REMOVE_TO_FAVORITE: {
    message: 'It was not possible to remove the video to favorites.',
    httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
  },
  YOUTUBE_LINK_ALREADY_EXISTS: {
    message: 'Youtube link already exists in database',
    httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
  },
  EMAIL_OR_USERNAME_ALREADY_USING: {
    message: 'Email or username already in use. Please choose another.',
    httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
  },
  GENRE_NOT_FOUND: {
    message: 'Genre not found',
    httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
  },
  LANGUAGE_NOT_FOUND: {
    message: 'Genre not found',
    httpCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
  },
  CREDENTIALS_INVALID: {
    message: 'Invalid credentials',
    httpCode: HttpStatusCode.FORBIDDEN,
  },
}
