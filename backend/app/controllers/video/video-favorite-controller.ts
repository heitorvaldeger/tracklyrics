import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { badRequest, serverError } from '#helpers/http'
import { uuidVideoValidator } from '#validators/video-validator'
import { inject } from '@adonisjs/core'
import { dispatch } from '#helpers/dispatch'
import { IVideoFavoriteService } from '#services/video/interfaces/IVideoFavoriteService'

@inject()
export default class VideoFavoriteController {
  constructor(private readonly videoFavoriteService: IVideoFavoriteService) {}

  async addFavorite({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const added = await this.videoFavoriteService.addFavorite(uuid)
      return dispatch(added)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }

  async removeFavorite({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const result = await this.videoFavoriteService.removeFavorite(uuid)
      return dispatch(result)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return badRequest(error.messages)
      }
      return serverError(error)
    }
  }
}
