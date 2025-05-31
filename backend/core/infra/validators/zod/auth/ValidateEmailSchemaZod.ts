import { z, ZodError } from 'zod'

import { IValidateEmailSchema } from '#core/domain/validators/ValidateEmailSchema'
import ValidationException from '#exceptions/ValidationException'

export class ValidateEmailSchemaZod implements IValidateEmailSchema {
  async validateAsync(data: any) {
    try {
      const schema = z.object({
        email: z.string().trim().email(),
        codeOTP: z.string().trim().length(6),
      })

      return await schema.parseAsync(data)
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
