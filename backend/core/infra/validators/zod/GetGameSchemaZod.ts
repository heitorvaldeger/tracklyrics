import { GetGameValidatorZod, ZodError } from '@tracklyrics/validators'

import { IGetGameSchema } from '#core/domain/validators/GetGameSchema'
import ValidationException from '#exceptions/ValidationException'

export class GetGameSchemaZod implements IGetGameSchema {
  async validateAsync(data: any) {
    try {
      return await GetGameValidatorZod.parseAsync(data)
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
