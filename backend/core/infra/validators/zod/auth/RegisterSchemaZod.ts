import { z, ZodError } from 'zod'

import { IRegisterSchema } from '#core/domain/validators/RegisterSchema'
import ValidationException from '#exceptions/ValidationException'

export class RegisterSchemaZod implements IRegisterSchema {
  async validateAsync(data: any) {
    try {
      const schema = z
        .object({
          email: z.string().trim().email(),
          password: z.string().trim().min(6),
          confirmPassword: z.string().trim().min(6),
          username: z.string().trim().min(4),
          firstName: z.string().trim().min(1),
          lastName: z.string().trim().min(1),
        })
        .refine(({ password, confirmPassword }) => password === confirmPassword, {
          message: 'Passwords do not match.',
          path: ['confirmPassword'],
        })
        .transform(({ confirmPassword, ...rest }) => rest)

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
