import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IUUIDValidatorSchema } from '#core/domain/validators/UUIDValidatorSchema'
import { ILyricFindService } from '#services/interfaces/lyric-find-service'

@inject()
export default class FindLyricController {
  constructor(
    private readonly lyricFindService: ILyricFindService,
    private readonly uuidValidatorSchema: IUUIDValidatorSchema
  ) {}

  async handle({ request }: HttpContext) {
    const { uuid } = await this.uuidValidatorSchema.validateAsync(request.params())

    return await this.lyricFindService.find(uuid)
  }
}
