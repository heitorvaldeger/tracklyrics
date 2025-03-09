import { HTTP_STATUS_CODE } from '#constants/http-status-code'

export const APPLICATION_MESSAGES = {
  VIDEO_NOT_FOUND: {
    message: 'Video not found',
    httpCode: HTTP_STATUS_CODE.NOT_FOUND,
  },
  VIDEO_UNPOSSIBLE_ADD_TO_FAVORITE: {
    message: 'It was not possible to add the video to favorites.',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  VIDEO_UNPOSSIBLE_REMOVE_TO_FAVORITE: {
    message: 'It was not possible to remove the video to favorites.',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  YOUTUBE_LINK_ALREADY_EXISTS: {
    message: 'Youtube link already exists in database',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  EMAIL_OR_USERNAME_ALREADY_USING: {
    message: 'Email or username already in use. Please choose another.',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  GENRE_NOT_FOUND: {
    message: 'Genre not found',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  LANGUAGE_NOT_FOUND: {
    message: 'Genre not found',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  CREDENTIALS_INVALID: {
    message: 'Invalid credentials',
    httpCode: HTTP_STATUS_CODE.UNAUTHORIZED,
  },
  EMAIL_PENDING_VALIDATION: {
    message: 'Your email address is pending of validation',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  EMAIL_HAS_BEEN_VERIFIED: {
    message: 'Your email address has been verified',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  EMAIL_INVALID: {
    message: 'Your email address is invalid',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  CODE_OTP_INVALID: {
    message: 'Code OTP is invalid',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  TOKEN_INVALID: {
    message: 'Token is invalid',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
  UNAUTHORIZED: {
    message: 'Unauthorized access',
    httpCode: HTTP_STATUS_CODE.UNAUTHORIZED,
  },
  USER_NOTFOUND: {
    message: 'User not found',
    httpCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  },
}
