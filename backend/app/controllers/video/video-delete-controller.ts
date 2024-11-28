import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { badRequest, serverError } from '#helpers/http'
import {
  createOrUpdateVideoValidator,
  findByVideoValidator,
  uuidVideoValidator,
} from '#validators/video-validator'
import { VideoFindProtocolService } from '#services/video/protocols/video-find-protocol-service'
import { inject } from '@adonisjs/core'
import { dispatch } from '#helpers/dispatch'
import { VideoDeleteProtocolService } from '#services/video/protocols/video-delete-protocol-service'

@inject()
export default class VideoDeleteController {
  constructor(private readonly videoDeleteService: VideoDeleteProtocolService) {}

  async delete({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())

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
