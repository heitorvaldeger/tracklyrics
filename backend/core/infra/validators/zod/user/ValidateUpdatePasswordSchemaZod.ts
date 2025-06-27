import { ValidateUpdatePasswordValidatorZod, ZodError } from '@tracklyrics/validators'

import { IValidateUpdatePasswordSchema } from '#core/domain/validators/ValidateUpdatePasswordSchema'
import ValidationException from '#exceptions/ValidationException'

export class ValidateUpdatePasswordSchemaZod implements IValidateUpdatePasswordSchema {
  async validateAsync(data: any) {
    try {
      return await ValidateUpdatePasswordValidatorZod.parseAsync(data)
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
