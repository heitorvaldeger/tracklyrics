import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dispatch } from '#helpers/dispatch'
import { VideoUpdateProtocolService } from '#services/protocols/video/video-update-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'
import { createOrUpdateVideoValidator } from '#validators/vinejs/video-validator'

@inject()
export default class VideoUpdateController {
  constructor(private readonly videoUpdateService: VideoUpdateProtocolService) {}

  async update({ request }: HttpContext) {
    try {
      const { uuid } = await uuidValidator.validate(request.params())
      const payload = await createOrUpdateVideoValidator.validate(request.body())

      const response = await this.videoUpdateService.update(payload, uuid)
      return dispatch(response)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
