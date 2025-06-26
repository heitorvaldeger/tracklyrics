import { SignInValidatorZod, ZodError } from '@tracklyrics/validators'

import { ISignInSchema } from '#core/domain/validators/SignInSchema'
import ValidationException from '#exceptions/ValidationException'

export class SignInSchemaZod implements ISignInSchema {
  async validateAsync(data: any) {
    try {
      return await SignInValidatorZod.parseAsync(data)
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
