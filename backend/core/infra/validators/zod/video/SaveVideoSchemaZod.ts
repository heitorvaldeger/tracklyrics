import { SaveVideoValidatorZod, ZodError } from '@tracklyrics/validators'

import { ISaveVideoSchema } from '#core/domain/validators/SaveVideoSchema'
import ValidationException from '#exceptions/ValidationException'
export class SaveVideoSchemaZod implements ISaveVideoSchema {
  async validateAsync(data: any) {
    try {
      return await SaveVideoValidatorZod.parseAsync(data)
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
