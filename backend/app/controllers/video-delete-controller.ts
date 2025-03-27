import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { VideoDeleteProtocolService } from '#services/_protocols/video-delete-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class VideoDeleteController {
  constructor(private readonly videoDeleteService: VideoDeleteProtocolService) {}

  async delete({ request, response }: HttpContext) {
    const [errors, data] = await uuidValidator.tryValidate(request.params())
    if (errors || !data) {
      return response.badRequest(errors.messages)
    }
    return await this.videoDeleteService.delete(data.uuid)
  }
}
