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
export default class VideoFindController {
  constructor(private videoService: VideoFindProtocolService) {}

  async find({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const response = await this.videoService.find(uuid)

      return dispatch(response)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }

  async findBy({ request }: HttpContext) {
    try {
      const queryParams = await findByVideoValidator.validate(request.qs())
      const response = await this.videoService.findBy(queryParams)

      return dispatch(response)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
