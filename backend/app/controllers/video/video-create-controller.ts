import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { badRequest, serverError } from '#helpers/http'
import { createOrUpdateVideoValidator, uuidVideoValidator } from '#validators/video-validator'
import { inject } from '@adonisjs/core'
import { dispatch } from '#helpers/dispatch'
import { VideoCreateProtocolService } from '#services/video/protocols/video-create-protocol-service'

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
      // if (error instanceof errors.E_VALIDATION_ERROR) {
      //   return badRequest(error.messages)
      // }

      // return serverError(error as Error)
    }
  }
}
