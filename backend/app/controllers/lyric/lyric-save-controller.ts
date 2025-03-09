import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dispatch } from '#helpers/dispatch'
import { LyricSaveProtocolService } from '#services/_protocols/lyric/lyric-save-protocol-service'
import { lyricSaveValidator } from '#validators/vinejs/lyric-save-validator'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class LyricSaveController {
  constructor(private readonly lyricSaveService: LyricSaveProtocolService) {}

  async save({ request }: HttpContext) {
    try {
      const { uuid } = await uuidValidator.validate(request.params())
      const lyrics = await lyricSaveValidator.validate(request.body())
      const added = await this.lyricSaveService.save({
        videoUuid: uuid,
        lyrics,
      })
      return dispatch(added)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
