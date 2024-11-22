import { errors } from '@vinejs/vine'
import { ErrorReporterContract, FieldContext } from '@vinejs/vine/types'
import vine from '@vinejs/vine'

class JSONAPIErrorReporter implements ErrorReporterContract {
  /**
   * A flag to know if one or more errors have been
   * reported
   */
  hasErrors: boolean = false

  /**
   * A collection of errors. Feel free to give accurate types
   * to this property
   */
  errors: any[] = []

  /**
   * VineJS call the report method
   */
  report(message: string, _rule: string, field: FieldContext, _meta?: any) {
    this.hasErrors = true

    /**
     * Collecting errors as per the JSONAPI spec
     */
    this.errors.push({
      field: field.name,
      message,
    })
  }

  /**
   * Creates and returns an instance of the
   * ValidationError class
   */
  createError() {
    return new errors.E_VALIDATION_ERROR(this.errors)
  }
}

vine.errorReporter = () => new JSONAPIErrorReporter()
