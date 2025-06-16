export type Errors = Array<{
  field: string
  error: string
}>

export default class ValidationException extends Error {
  errors: Errors = []
  code: string = 'E_VALIDATION_ERROR'

  constructor(errors: Errors) {
    super('Validation failed for the submitted data.')
    this.errors = errors
  }
}
