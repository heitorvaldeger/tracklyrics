import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { ISaveVideoSchema } from '#core/domain/validators/SaveVideoSchema'
import { IVideoCreateService } from '#services/interfaces/video-create-service'

@inject()
export default class CreateVideoController {
  constructor(
    private readonly videoCreateService: IVideoCreateService,
    private readonly saveVideoValidator: ISaveVideoSchema
  ) {}

  async handle({ request }: HttpContext) {
    const data = await this.saveVideoValidator.validateAsync(request.body())

    return await this.videoCreateService.create(data)
  }
}
