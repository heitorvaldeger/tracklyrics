import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { badRequest, serverError } from '#helpers/http'
import { createOrUpdateVideoValidator, uuidVideoValidator } from '#validators/video-validator'
import { inject } from '@adonisjs/core'
import { dispatch } from '#helpers/dispatch'
import { IVideoUpdateService } from '#services/video/interfaces/IVideoUpdateService'

@inject()
export default class VideoUpdateController {
  constructor(private readonly videoUpdateService: IVideoUpdateService) {}

  async update({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const payload = await createOrUpdateVideoValidator.validate(request.body())

      const response = await this.videoUpdateService.update(payload, uuid)
      return dispatch(response)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }

      return serverError(error as Error)
    }
  }
}
