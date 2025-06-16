import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IFindByVideoSchema } from '#core/domain/validators/FindByVideoSchema'
import { IVideoFindService } from '#services/interfaces/video-find-service'

@inject()
export default class FindByVideoController {
  constructor(
    private readonly videoService: IVideoFindService,
    private readonly findByVideoSchema: IFindByVideoSchema
  ) {}

  async handle({ request }: HttpContext) {
    const data = await this.findByVideoSchema.validateAsync(request.qs())
    return await this.videoService.findBy(data)
  }
}
