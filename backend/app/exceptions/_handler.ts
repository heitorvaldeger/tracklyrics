import { errors } from '@adonisjs/auth'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

import CodeOtpInvalidException from './code-otp-invalid-exception.js'
import EmailHasBeenVerifiedException from './email-has-been-verified-exception.js'
import EmailInvalidException from './email-invalid-exception.js'
import EmailPendingValidationException from './email-pending-validation-exception.js'
import GenericException from './generic-exception.js'
import GenreNotFoundException from './genre-not-found-exception.js'
import InvalidCredentialsException from './invalid-credentials-exception.js'
import LanguageNotFoundException from './language-not-found-exception.js'
import UnauthorizedException from './unauthorized-exception.js'
import UserNotFoundException from './user-not-found-exception.js'
import UserOrEmailAlreadyUsingException from './user-or-email-already-using-exception.js'
import VideoNotFoundException from './video-not-found-exception.js'
import YoutubeLinkAlreadyExistsException from './youtube-link-already-exists-exception.js'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    if (
      [
        VideoNotFoundException,
        CodeOtpInvalidException,
        EmailHasBeenVerifiedException,
        EmailInvalidException,
        EmailPendingValidationException,
        GenericException,
        GenreNotFoundException,
        InvalidCredentialsException,
        LanguageNotFoundException,
        UnauthorizedException,
        UserNotFoundException,
        UserOrEmailAlreadyUsingException,
        VideoNotFoundException,
        YoutubeLinkAlreadyExistsException,
      ].some((e) => error instanceof e)
    ) {
      return ctx.response.status(error.status).json({
        code: error.code,
        message: error.message,
      })
    }

    if (
      error instanceof errors.E_UNAUTHORIZED_ACCESS ||
      error instanceof errors.E_INVALID_CREDENTIALS
    ) {
      return ctx.response.status(401).json({
        code: error.code,
        message: error.message,
      })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
