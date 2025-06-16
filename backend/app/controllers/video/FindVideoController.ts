import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IUUIDValidatorSchema } from '#core/domain/validators/UUIDValidatorSchema'
import { IVideoFindService } from '#services/interfaces/video-find-service'

@inject()
export default class FindVideoController {
  constructor(
    private readonly videoService: IVideoFindService,
    private readonly uuidValidatorSchema: IUUIDValidatorSchema
  ) {}

  async handle({ request }: HttpContext) {
    const { uuid } = await this.uuidValidatorSchema.validateAsync(request.params())
    return await this.videoService.find(uuid)
  }
}
