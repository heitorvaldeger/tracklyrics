import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IVideoCreateService } from '#services/interfaces/video-create-service'
import { createOrUpdateVideoValidator } from '#validators/vinejs/video-validator'

@inject()
export default class VideoCreateController {
  constructor(private readonly videoCreateService: IVideoCreateService) {}

  async create({ request, response }: HttpContext) {
    const [errors, data] = await createOrUpdateVideoValidator.tryValidate(request.body())

    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.videoCreateService.create(data)
  }
}
