import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dispatch } from '#helpers/dispatch'
import { VideoDeleteProtocolService } from '#services/protocols/video/video-delete-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class VideoDeleteController {
  constructor(private readonly videoDeleteService: VideoDeleteProtocolService) {}

  async delete({ request }: HttpContext) {
    try {
      const { uuid } = await uuidValidator.validate(request.params())

      const deleted = await this.videoDeleteService.delete(uuid)
      return dispatch(deleted)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
