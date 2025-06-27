import { FindVideoValidatorZod, ZodError } from '@tracklyrics/validators'

import { IFindByVideoSchema } from '#core/domain/validators/FindByVideoSchema'
import ValidationException from '#exceptions/ValidationException'

export class FindByVideoSchemaZod implements IFindByVideoSchema {
  async validateAsync(data: any) {
    try {
      return await FindVideoValidatorZod.parseAsync(data)
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
