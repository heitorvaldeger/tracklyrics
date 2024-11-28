import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { badRequest, serverError } from '#helpers/http'
import { createOrUpdateVideoValidator, uuidVideoValidator } from '#validators/video-validator'
import { inject } from '@adonisjs/core'
import { dispatch } from '#helpers/dispatch'
import { VideoUpdateProtocolService } from '#services/video/protocols/video-update-protocol-service'

@inject()
export default class VideoUpdateController {
  constructor(private readonly videoUpdateService: VideoUpdateProtocolService) {}

  async update({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
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
