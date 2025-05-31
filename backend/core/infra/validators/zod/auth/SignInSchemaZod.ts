import { z, ZodError } from 'zod'

import { ISignInSchema } from '#core/domain/validators/SignInSchema'
import ValidationException from '#exceptions/ValidationException'

export class SignInSchemaZod implements ISignInSchema {
  async validateAsync(data: any) {
    try {
      const schema = z.object({
        email: z.string().trim().email(),
        password: z.string().trim().min(6),
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
