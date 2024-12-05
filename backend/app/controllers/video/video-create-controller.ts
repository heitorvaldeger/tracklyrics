import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dispatch } from '#helpers/dispatch'
import { VideoCreateProtocolService } from '#services/video/protocols/video-create-protocol-service'
import { createOrUpdateVideoValidator } from '#validators/video-validator'

@inject()
export default class VideoCreateController {
  constructor(private readonly videoCreateService: VideoCreateProtocolService) {}

  async create({ request }: HttpContext) {
    try {
      const payload = await createOrUpdateVideoValidator.validate(request.body())
      const response = await this.videoCreateService.create(payload)
      return dispatch(response)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
