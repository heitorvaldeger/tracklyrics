import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dispatch } from '#helpers/dispatch'
import { VideoFindProtocolService } from '#services/_protocols/video/video-find-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'
import { findByVideoValidator } from '#validators/vinejs/video-validator'

@inject()
export default class VideoFindController {
  constructor(private videoService: VideoFindProtocolService) {}

  async find({ request }: HttpContext) {
    try {
      const { uuid } = await uuidValidator.validate(request.params())
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
