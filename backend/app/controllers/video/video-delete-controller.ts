import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { badRequest, serverError } from '#helpers/http'
import {
  createOrUpdateVideoValidator,
  findByVideoValidator,
  uuidVideoValidator,
} from '#validators/video-validator'
import { IVideoService } from '#services/interfaces/IVideoService'
import { inject } from '@adonisjs/core'
import { dispatch } from '#helpers/dispatch'
import { IVideoDeleteService } from '#services/video/interfaces/IVideoDeleteService'

@inject()
export default class VideoDeleteController {
  constructor(private readonly videoDeleteService: IVideoDeleteService) {}

  async delete({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())

      const deleted = await this.videoDeleteService.delete(uuid)
      return dispatch(deleted)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }
}
