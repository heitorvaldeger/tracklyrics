import { z, ZodError } from 'zod'

import { IUpdatePasswordSchema } from '#core/domain/validators/UpdatePasswordSchema'
import ValidationException from '#exceptions/ValidationException'

export class UpdatePasswordSchemaZod implements IUpdatePasswordSchema {
  async validateAsync(data: any) {
    try {
      const schema = z.object({
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
