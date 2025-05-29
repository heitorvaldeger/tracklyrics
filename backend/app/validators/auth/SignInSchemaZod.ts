import { z, ZodError } from 'zod'

import ValidationException from '#exceptions/ValidationException'

import { ISignInSchema } from './interfaces/SignInSchema.js'

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
