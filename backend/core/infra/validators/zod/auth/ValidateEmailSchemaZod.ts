import { ValidateEmailValidatorZod, ZodError } from '@tracklyrics/validators'

import { IValidateEmailSchema } from '#core/domain/validators/ValidateEmailSchema'
import ValidationException from '#exceptions/ValidationException'

export class ValidateEmailSchemaZod implements IValidateEmailSchema {
  async validateAsync(data: any) {
    try {
      return await ValidateEmailValidatorZod.parseAsync(data)
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          error: err.message,
        }))

        throw new ValidationException(errors)
      }

      throw new Error('')
    }
  }
}
