import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IVideoFindService } from '#services/interfaces/video-find-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'
import { findByVideoValidator } from '#validators/vinejs/video-validator'

@inject()
export default class VideoFindController {
  constructor(private videoService: IVideoFindService) {}

  async find({ request, response }: HttpContext) {
    const [errors, data] = await uuidValidator.tryValidate(request.params())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.videoService.find(data.uuid)
  }

  async findBy({ request, response }: HttpContext) {
    const [errors, data] = await findByVideoValidator.tryValidate(request.qs())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.videoService.findBy(data)
  }
}
