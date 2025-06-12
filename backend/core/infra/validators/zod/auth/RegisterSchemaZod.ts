import { RegisterValidatorZod, ZodError } from '@tracklyrics/validators'

import { IRegisterSchema } from '#core/domain/validators/RegisterSchema'
import ValidationException from '#exceptions/ValidationException'

export class RegisterSchemaZod implements IRegisterSchema {
  async validateAsync(data: any) {
    try {
      const { confirmPassword, ...rest } = await RegisterValidatorZod.parseAsync(data)
      return { ...rest }
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
