import { z, ZodError } from 'zod'

import { IGetGameSchema } from '#core/domain/validators/GetGameSchema'
import { GameModesHash } from '#enums/game-modes-hash'
import ValidationException from '#exceptions/ValidationException'

export class GetGameSchemaZod implements IGetGameSchema {
  async validateAsync(data: any) {
    try {
      const schema = z.object({
        uuid: z.string().trim().uuid(),
        mode: z.nativeEnum(GameModesHash),
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
