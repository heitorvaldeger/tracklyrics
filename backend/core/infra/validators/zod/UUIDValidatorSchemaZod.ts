import { UUIDValidatorZod, ZodError } from '@tracklyrics/validators'

import { IUUIDValidatorSchema } from '#core/domain/validators/UUIDValidatorSchema'
import ValidationException from '#exceptions/ValidationException'

export class UUIDValidatorSchemaZod implements IUUIDValidatorSchema {
  async validateAsync(data: any) {
    try {
      return await UUIDValidatorZod.parseAsync(data)
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
