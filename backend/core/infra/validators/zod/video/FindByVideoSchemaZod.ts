import { z, ZodError } from 'zod'

import { IFindByVideoSchema } from '#core/domain/validators/FindByVideoSchema'
import ValidationException from '#exceptions/ValidationException'

export class FindByVideoSchemaZod implements IFindByVideoSchema {
  async validateAsync(data: any) {
    try {
      const schema = z.object({
        genreId: z.coerce.number().int().optional(),
        languageId: z.coerce.number().int().optional(),
        userUuid: z.string().uuid().optional(),
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
