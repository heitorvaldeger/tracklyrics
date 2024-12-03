import type { HttpContext } from '@adonisjs/core/http'
import { uuidVideoValidator } from '#validators/video-validator'
import { inject } from '@adonisjs/core'
import { dispatch } from '#helpers/dispatch'
import { VideoFavoriteProtocolService } from '#services/video/protocols/video-favorite-protocol-service'

@inject()
export default class VideoFavoriteController {
  constructor(private readonly videoFavoriteService: VideoFavoriteProtocolService) {}

  async addFavorite({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const added = await this.videoFavoriteService.addFavorite(uuid)
      return dispatch(added)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }

  async removeFavorite({ request }: HttpContext) {
    try {
      const { uuid } = await uuidVideoValidator.validate(request.params())
      const result = await this.videoFavoriteService.removeFavorite(uuid)
      return dispatch(result)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
