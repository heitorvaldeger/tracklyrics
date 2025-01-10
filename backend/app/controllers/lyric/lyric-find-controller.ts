import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dispatch } from '#helpers/dispatch'
import { LyricFindProtocolService } from '#services/protocols/lyric/lyric-find-protocol-service'
import { uuidValidator } from '#validators/vinejs/uuid-validator'

@inject()
export default class LyricFindController {
  constructor(private readonly lyricFindService: LyricFindProtocolService) {}

  async find({ request }: HttpContext) {
    try {
      const { uuid } = await uuidValidator.validate(request.params())
      const lyrics = await this.lyricFindService.find(uuid)
      return dispatch(lyrics)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
